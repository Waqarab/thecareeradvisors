"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, doc, deleteDoc, setDoc, getDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Trash2, RefreshCcw, ShieldAlert, History, School, Users } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { useConfirm } from "@/components/ui/use-confirm";

interface RecycledItem {
  id: string;
  type: "university" | "inquiry";
  name: string;
  subtitle: string;
  image?: string;
  deletedAt: string;
  data: any; // The raw data to restore
}

export default function RecycleBinPage() {
  const [items, setItems] = useState<RecycledItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"university" | "inquiry">("university");
  const { ConfirmationDialog, confirmAction } = useConfirm();

  const fetchAndCleanRecycled = async () => {
    setLoading(true);
    try {
      const now = new Date();
      const allItems: RecycledItem[] = [];
      const cleanupPromises: Promise<void>[] = [];

      // 1. Fetch Universities
      const uniSnapshot = await getDocs(collection(db, "recycled_universities"));
      uniSnapshot.docs.forEach((document) => {
        const data = document.data();
        const deletedAtDate = new Date(data.deletedAt);
        const daysDiff = (now.getTime() - deletedAtDate.getTime()) / (1000 * 3600 * 24);

        if (daysDiff > 14) {
          cleanupPromises.push(deleteDoc(doc(db, "recycled_universities", document.id)));
        } else {
          allItems.push({
            id: document.id,
            type: "university",
            name: data.name || "Unknown University",
            subtitle: `${data.location || ""}, ${data.country || ""}`,
            image: data.image || "",
            deletedAt: data.deletedAt,
            data
          });
        }
      });

      // 2. Fetch Inquiries
      const inqSnapshot = await getDocs(collection(db, "recycled_inquiries"));
      inqSnapshot.docs.forEach((document) => {
        const data = document.data();
        const deletedAtDate = new Date(data.deletedAt);
        const daysDiff = (now.getTime() - deletedAtDate.getTime()) / (1000 * 3600 * 24);

        if (daysDiff > 14) {
          cleanupPromises.push(deleteDoc(doc(db, "recycled_inquiries", document.id)));
        } else {
          allItems.push({
            id: document.id,
            type: "inquiry",
            name: data.name || "Unknown Lead",
            subtitle: data.email || data.phone || "No contact info",
            deletedAt: data.deletedAt,
            data
          });
        }
      });

      if (cleanupPromises.length > 0) {
        await Promise.all(cleanupPromises);
      }

      setItems(allItems.sort((a, b) => new Date(b.deletedAt).getTime() - new Date(a.deletedAt).getTime()));
    } catch (error) {
      console.error("Error fetching recycled:", error);
      toast.error("Failed to load recycle bin");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAndCleanRecycled();
  }, []);

  const handleRestore = async (item: RecycledItem) => {
    setActionLoading(item.id + "-restore");
    try {
      const collName = item.type === "university" ? "universities" : "inquiries";
      const recycledCollName = item.type === "university" ? "recycled_universities" : "recycled_inquiries";
      
      const docRef = doc(db, recycledCollName, item.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        delete data.deletedAt;

        await setDoc(doc(db, collName, item.id), data);
        await deleteDoc(docRef);

        toast.success(`${item.type === "university" ? "University" : "Inquiry"} restored successfully!`);
        
        if (item.type === "university") {
          await fetch(`/api/revalidate?tag=universities`, { method: "POST" });
        }
        
        fetchAndCleanRecycled();
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to restore");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRestoreAll = async () => {
    const isConfirmed = await confirmAction(
      "Restore All",
      `Are you sure you want to restore ALL ${activeTab === "university" ? "universities" : "inquiries"}?`
    );
    if (!isConfirmed) return;
    
    setLoading(true);
    try {
      const itemsToRestore = items.filter(i => i.type === activeTab);
      
      const restorePromises = itemsToRestore.map(async (item) => {
        const collName = item.type === "university" ? "universities" : "inquiries";
        const recycledCollName = item.type === "university" ? "recycled_universities" : "recycled_inquiries";
        
        const docRef = doc(db, recycledCollName, item.id);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          delete data.deletedAt;

          await setDoc(doc(db, collName, item.id), data);
          await deleteDoc(docRef);
          return true;
        }
        return false;
      });

      const results = await Promise.all(restorePromises);
      const successCount = results.filter(Boolean).length;

      if (successCount > 0) {
        toast.success(`Successfully restored ${successCount} items!`);
        if (activeTab === "university") {
          await fetch(`/api/revalidate?tag=universities`, { method: "POST" });
        }
        fetchAndCleanRecycled();
      } else {
        toast.info("No items were restored.");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred during bulk restore");
    } finally {
      setLoading(false);
    }
  };

  const handlePermanentDelete = async (item: RecycledItem) => {
    const isConfirmed = await confirmAction(
      "Permanent Delete",
      "Are you SURE you want to permanently delete this? It cannot be undone.",
      { isDestructive: true, confirmText: "Delete" }
    );
    if (!isConfirmed) return;

    setActionLoading(item.id + "-delete");
    try {
      const recycledCollName = item.type === "university" ? "recycled_universities" : "recycled_inquiries";
      await deleteDoc(doc(db, recycledCollName, item.id));
      toast.success("Permanently deleted");
      fetchAndCleanRecycled();
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete permanently");
    } finally {
      setActionLoading(null);
    }
  };

  const formatDaysLeft = (dateString: string) => {
    const deletedDate = new Date(dateString);
    const expiryDate = new Date(deletedDate.getTime() + 14 * 24 * 60 * 60 * 1000);
    const now = new Date();
    const daysLeft = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    return daysLeft;
  };

  const displayedItems = items.filter(i => i.type === activeTab);

  return (
    <>
      <ConfirmationDialog />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4">
          <div className="bg-red-100 p-3 rounded-xl">
            <History className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Recycle Bin</h1>
            <p className="text-sm text-gray-500">
              Items will stay here for 14 days before being permanently removed.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:items-center justify-between">
        <div className="flex space-x-2">
          <Button 
            variant={activeTab === "university" ? "default" : "outline"}
            onClick={() => setActiveTab("university")}
            className={activeTab === "university" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            <School className="w-4 h-4 mr-2" />
            Universities ({items.filter(i => i.type === "university").length})
          </Button>
          <Button 
            variant={activeTab === "inquiry" ? "default" : "outline"}
            onClick={() => setActiveTab("inquiry")}
            className={activeTab === "inquiry" ? "bg-indigo-600 hover:bg-indigo-700" : ""}
          >
            <Users className="w-4 h-4 mr-2" />
            Inquiries ({items.filter(i => i.type === "inquiry").length})
          </Button>
        </div>
        
        {displayedItems.length > 0 && (
          <Button
            variant="outline"
            onClick={handleRestoreAll}
            disabled={loading}
            className="border-indigo-600 text-indigo-600 hover:bg-indigo-50"
          >
            <RefreshCcw className="w-4 h-4 mr-2" />
            Restore All {activeTab === "university" ? "Universities" : "Inquiries"}
          </Button>
        )}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-gray-500">
            <ShieldAlert className="w-12 h-12 mb-4 text-gray-300" />
            <p className="text-lg font-medium">Recycle Bin is empty</p>
            <p className="text-sm">No deleted {activeTab === "university" ? "universities" : "inquiries"} found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-gray-500 uppercase bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 font-medium">Details</th>
                  <th className="px-6 py-4 font-medium">Time Left</th>
                  <th className="px-6 py-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {displayedItems.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {item.type === "university" ? (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden relative flex-shrink-0">
                            {item.image ? (
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                No Img
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-indigo-400" />
                          </div>
                        )}
                        <div>
                          <div className="font-medium text-gray-900">{item.name}</div>
                          <div className="text-gray-500 text-xs">{item.subtitle}</div>
                          <div className="text-gray-400 text-[10px] mt-0.5">Deleted: {new Date(item.deletedAt).toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${formatDaysLeft(item.deletedAt) <= 3 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                        {formatDaysLeft(item.deletedAt)} days left
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-green-600 hover:text-green-700 hover:bg-green-50 border-green-200"
                          onClick={() => handleRestore(item)}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === item.id + "-restore" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCcw className="w-4 h-4 mr-2" />}
                          Restore
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          onClick={() => handlePermanentDelete(item)}
                          disabled={actionLoading !== null}
                        >
                          {actionLoading === item.id + "-delete" ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
                          Delete
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
    </>
  );
}
