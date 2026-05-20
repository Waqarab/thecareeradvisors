"use client";

import { useEffect } from "react";
import { toast } from "sonner";
import { BellRing } from "lucide-react";

export default function NotificationManager() {
  useEffect(() => {
    // Wait a few seconds after the site loads so we don't overwhelm them instantly
    const timer = setTimeout(() => {
      checkAndPromptPermission();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  const checkAndPromptPermission = () => {
    if (!("Notification" in window)) return;
    if (Notification.permission === "granted" || Notification.permission === "denied") return;

    // Check LocalStorage for logic: Only ask twice, with a 24-hour gap.
    const prompts = parseInt(localStorage.getItem("notifPromptCount") || "0");
    const lastPrompt = parseInt(localStorage.getItem("notifLastPrompt") || "0");
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // If we've asked less than 2 times, AND it's been more than a day since the last prompt
    if (prompts < 2 && (now - lastPrompt) > oneDay) {
      showCustomPrompt();
      
      // Update local storage
      localStorage.setItem("notifPromptCount", (prompts + 1).toString());
      localStorage.setItem("notifLastPrompt", now.toString());
    }
  };

  const showCustomPrompt = () => {
    // We use Sonner to show a beautiful UI Toast asking them to enable notifications
    toast("Enable Live Updates?", {
      description: "Get instant alerts on admission deadlines, new university slots, and exclusive fee drops.",
      icon: <BellRing className="w-5 h-5 text-primary" />,
      duration: 10000,
      action: {
        label: "Allow",
        onClick: () => {
          Notification.requestPermission().then((permission) => {
            if (permission === "granted") {
              fireMarketingNotification();
            }
          });
        },
      },
      cancel: {
        label: "Later",
        onClick: () => console.log("User dismissed notification prompt"),
      }
    });
  };

  // Example of how the Admin triggers a notification with sound
  const fireMarketingNotification = () => {
    // 1. Play Custom Sound (You will need to place a tiny 'pop.mp3' in your /public folder)
    try {
      const audio = new Audio('/pop.mp3');
      audio.play();
    } catch (e) {
      console.log("Audio play blocked by browser, but notification will still show.");
    }

    // 2. Fire the actual system notification
    new Notification("🔥 2 Students Enrolled Just Now!", {
      body: "Ayaan and 1 other just secured their seats in Kazan Federal University.",
      icon: "/logo.png", // Uses your company logo in the notification!
    });
  };

  return null; // This component has no visual UI of its own, it just runs logic
}