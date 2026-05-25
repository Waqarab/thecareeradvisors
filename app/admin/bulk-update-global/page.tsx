"use client";

import { useState } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { Button } from "@/components/ui/button";
import { Loader2, Globe2, ShieldAlert } from "lucide-react";
import { toast } from "sonner";

// ALL GLOBAL DATA METICULOUSLY EXTRACTED (INCLUDING RANKINGS, REASONS, AND EXACT DATES)
const globalData = [
  // --- UZBEKISTAN ---
  {
    matchName: "Samarkand State",
    data: {
      established: "1930",
      description: "Samarkand State Medical University is one of the oldest and most prestigious medical universities in Central Asia. The university is highly respected for its strong academic system, medical research, experienced faculty, and advanced clinical training facilities.",
      historicalBackground: "The university was established to develop modern medical education and healthcare services in the region. Over the decades, it has become one of Uzbekistan’s leading medical institutions.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, modern laboratories, simulation centers, research departments, and advanced clinical facilities that provide students with excellent practical exposure and hospital training.",
      fees: "3,850 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with proper security, furnished accommodation, and food facilities. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "One of the leading medical universities in Uzbekistan",
        "Internationally recognized medical degree",
        "Strong academic and research reputation"
      ],
      whyChoose: [
        "One of the oldest medical universities in Central Asia",
        "Strong academic and research environment",
        "Modern infrastructure and clinical facilities",
        "English-medium MBBS programs",
        "Affordable tuition fees",
        "International student-friendly campus"
      ]
    }
  },
  {
    matchName: "Tashkent State",
    data: {
      established: "Originally established in 1919 as the Faculty of Medicine of Turkestan State University",
      description: "Tashkent State Medical University is one of the leading and oldest medical institutions in Uzbekistan. The university is highly recognized for its quality medical education, experienced faculty, modern infrastructure, and international student environment.",
      historicalBackground: "The university has a long history of medical education in Central Asia and has played a major role in training healthcare professionals for decades. Over the years, it evolved through multiple reforms and mergers.",
      hospitalFacilities: "The university has multiple affiliated hospitals, clinical departments, modern laboratories, research centers, simulation labs, and teaching facilities that provide students with strong clinical exposure.",
      fees: "3,500 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls with proper security, furnished rooms, and food facilities. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO, NMC, and international medical bodies",
        "Featured in Times Higher Education rankings",
        "One of the leading medical universities in Uzbekistan"
      ],
      whyChoose: [
        "One of the oldest medical universities in Central Asia",
        "Modern infrastructure and laboratories",
        "English-medium MBBS programs",
        "International student community",
        "Affordable tuition fees",
        "Strong practical and clinical exposure"
      ]
    }
  },
  {
    matchName: "Bukhara",
    data: {
      established: "1990",
      description: "Bukhara State Medical Institute is one of the well-known medical universities in Uzbekistan recognized for quality medical education, experienced faculty, and practical clinical training.",
      historicalBackground: "The university was established to strengthen medical education and healthcare training in Uzbekistan. Over the years, it has developed into a respected institution providing modern medical education.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and modern healthcare facilities that provide students with practical clinical exposure.",
      fees: "3,200 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "International student-friendly institution",
        "Known for quality medical education in Central Asia"
      ],
      whyChoose: [
        "Affordable MBBS fees",
        "English-medium medical programs",
        "Practical-oriented education",
        "Modern infrastructure and laboratories",
        "Safe and peaceful student environment",
        "Growing international student community"
      ]
    }
  },
  {
    matchName: "Pharmaceutical",
    data: {
      established: "1937",
      description: "Tashkent Pharmaceutical Institute is one of the leading pharmaceutical and medical science institutions in Uzbekistan. It is recognized for its quality education in pharmacy, medical sciences, and healthcare research.",
      historicalBackground: "The institute was established to strengthen pharmaceutical education and healthcare research in Uzbekistan. It developed into one of the country’s respected higher educational institutions.",
      hospitalFacilities: "The university is associated with laboratories, research centers, healthcare departments, and clinical training facilities that help students gain practical exposure.",
      fees: "3,500 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized institution",
        "Recognized by international educational bodies",
        "Known for pharmaceutical and healthcare education",
        "International student-friendly environment"
      ],
      whyChoose: [
        "Specialized healthcare and pharmaceutical education",
        "Affordable tuition fees",
        "Modern laboratories and infrastructure",
        "International student environment",
        "Practical-oriented learning",
        "Located in the capital city of Tashkent"
      ]
    }
  },
  {
    matchName: "Gulistan",
    data: {
      established: "1965",
      description: "Gulistan State University is a recognized public university in Uzbekistan known for affordable education, modern academic facilities, and a student-friendly environment.",
      historicalBackground: "The university was established to promote higher education and professional training in Uzbekistan. Over the years, it expanded its academic departments and infrastructure.",
      hospitalFacilities: "The university is associated with teaching hospitals, laboratories, healthcare departments, and clinical training centers that provide students with hands-on learning opportunities.",
      fees: "2,800 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized public university",
        "Recognized by relevant educational authorities",
        "Growing international student enrollment",
        "Affordable higher education institution in Uzbekistan"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "Student-friendly environment",
        "Developing modern infrastructure",
        "Practical-oriented learning",
        "Safe and peaceful city environment",
        "Growing popularity among international students"
      ]
    }
  },
  {
    matchName: "Andijan",
    data: {
      established: "1955",
      description: "Andijan State Medical Institute is one of the recognized medical institutions in Uzbekistan known for quality medical education, experienced faculty, and practical clinical training.",
      historicalBackground: "The institute was established to strengthen medical education and healthcare services in Uzbekistan. It produces qualified healthcare professionals for national and international sectors.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare facilities that provide students with valuable clinical exposure.",
      fees: "3,500 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical institute",
        "International student-friendly university",
        "Known for practical-oriented medical education"
      ],
      whyChoose: [
        "Affordable MBBS fees",
        "English-medium medical programs",
        "Modern infrastructure and laboratories",
        "Practical clinical exposure",
        "Safe and student-friendly environment",
        "Growing international student community"
      ]
    }
  },
  {
    matchName: "Angren",
    data: {
      established: "2022",
      description: "Angren State University is a developing public university in Uzbekistan known for affordable education, modern academic facilities, and a peaceful student environment.",
      historicalBackground: "The university was established as part of Uzbekistan’s educational development initiatives to expand higher education opportunities and modern professional training.",
      hospitalFacilities: "The university is associated with healthcare departments, laboratories, practical training centers, and affiliated clinical facilities.",
      fees: "2,500 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized public university",
        "Modern and developing academic institution",
        "International student-friendly environment",
        "Affordable higher education option in Uzbekistan"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "Peaceful and student-friendly environment",
        "Modern developing infrastructure",
        "Practical-oriented learning",
        "Budget-friendly living expenses",
        "Growing popularity among international students"
      ]
    }
  },

  // --- EGYPT ---
  {
    matchName: "Ain Shams",
    data: {
      established: "1950",
      description: "Ain Shams University is one of the leading public universities in Egypt and among the most respected educational institutions in the Middle East. It is known for its excellence in medical education and scientific research.",
      historicalBackground: "The university was originally established under the name Ibrahim Pasha University and later renamed Ain Shams University. Its name is historically linked to the ancient city of Heliopolis.",
      hospitalFacilities: "The university has multiple teaching hospitals, modern laboratories, specialized medical centers, research departments, and advanced clinical facilities.",
      fees: "8,000 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range around 1,500 USD per year.",
      recognition: [
        "One of Egypt’s top public universities",
        "Recognized by WHO, NMC, and international medical bodies",
        "Strong QS World University Rankings presence",
        "Internationally respected medical and research programs"
      ],
      whyChoose: [
        "Globally recognized medical degree",
        "Strong hospital and clinical training",
        "Modern medical infrastructure",
        "International student environment",
        "Strong academic and research reputation",
        "Affordable compared to many Western countries"
      ]
    }
  },
  {
    matchName: "Alexandria",
    data: {
      established: "1938",
      description: "Alexandria University is one of the leading public universities in Egypt known for quality medical education, international academic collaborations, and advanced research programs.",
      historicalBackground: "Alexandria University was initially established as a branch of Cairo University before becoming an independent institution.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, research centers, clinical departments, and advanced healthcare facilities.",
      fees: "8,000 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate hostel and mess expenses range around 1,500 USD per year.",
      recognition: [
        "One of the top public universities in Egypt",
        "Recognized by WHO, NMC, and international medical bodies",
        "Strong QS World University Rankings presence",
        "Internationally recognized medical education programs"
      ],
      whyChoose: [
        "Globally recognized medical degree",
        "Strong practical and clinical exposure",
        "International student environment",
        "Quality education with affordable tuition",
        "Beautiful coastal city environment",
        "Strong academic and research reputation"
      ]
    }
  },

  // --- KAZAKHSTAN ---
  {
    matchName: "Kazakh National",
    data: {
      established: "1930",
      description: "Kazakh National Medical University (KazNMU) is one of the oldest and most prestigious medical universities in Kazakhstan. It is internationally recognized for its modern infrastructure and strong clinical exposure.",
      historicalBackground: "The university was established to develop modern medical education and healthcare services in Kazakhstan.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, research centers, laboratories, simulation centers, and advanced clinical departments.",
      fees: "Approx. 5.2 lakh INR per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 2,000 USD per year.",
      recognition: [
        "One of the top medical universities in Kazakhstan",
        "Recognized by WHO, NMC, and international medical bodies",
        "Strong international academic reputation",
        "Modern research and healthcare training facilities"
      ],
      whyChoose: [
        "One of the oldest medical universities in Kazakhstan",
        "Globally recognized medical degree",
        "Modern infrastructure and laboratories",
        "Strong practical and clinical exposure",
        "International student environment",
        "Affordable compared to Western countries"
      ]
    }
  },
  {
    matchName: "Al-Farabi",
    data: {
      established: "1934",
      description: "Al-Farabi Kazakh National University is one of the leading and highest-ranked universities in Central Asia. It is internationally recognized for academic excellence and global educational standards.",
      historicalBackground: "The university was established during the Soviet era. Named after the famous philosopher Al-Farabi.",
      hospitalFacilities: "The university is associated with teaching hospitals, research laboratories, simulation centers, healthcare departments, and advanced clinical facilities.",
      fees: "Approx. 4.5 lakh INR per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 2,000 USD per year.",
      recognition: [
        "One of the top-ranked universities in Central Asia",
        "Recognized by WHO, NMC, and international educational bodies",
        "Strong QS World University Rankings presence",
        "Internationally respected academic and research institution"
      ],
      whyChoose: [
        "One of the highest-ranked universities in Kazakhstan",
        "Strong international reputation",
        "Modern infrastructure and research facilities",
        "Globally recognized degree",
        "International student-friendly environment",
        "Affordable education compared to many Western countries"
      ]
    }
  },
  {
    matchName: "West Kazakhstan",
    data: {
      established: "1957",
      description: "West Kazakhstan Medical University is one of the recognized medical universities in Kazakhstan known for quality medical education, experienced faculty, modern infrastructure, and practical clinical training.",
      historicalBackground: "The university was established to improve medical education and healthcare services in western Kazakhstan.",
      hospitalFacilities: "The university is associated with teaching hospitals, laboratories, simulation centers, healthcare departments, and modern clinical facilities.",
      fees: "4,000 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 2,000 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "International student-friendly institution",
        "Known for practical-oriented medical education"
      ],
      whyChoose: [
        "Affordable MBBS tuition fees",
        "English-medium medical programs",
        "Modern infrastructure and laboratories",
        "Strong clinical exposure",
        "International student environment",
        "Safe and peaceful city environment"
      ]
    }
  },

  // --- RUSSIA ---
  {
    matchName: "North Ossetian",
    data: {
      established: "1939",
      description: "North Ossetian State Medical Academy is one of the recognized medical universities in Russia known for quality medical education, affordable tuition fees, and strong practical training.",
      historicalBackground: "The academy was established to strengthen medical education and healthcare services in the North Caucasus region of Russia.",
      hospitalFacilities: "The academy is associated with teaching hospitals, laboratories, research centers, simulation facilities, and modern clinical departments.",
      fees: "310,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical academy",
        "International student-friendly environment",
        "Known for affordable and practical medical education"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Strong practical and clinical exposure",
        "Internationally recognized medical degree",
        "Safe and student-friendly environment",
        "Growing international student community"
      ]
    }
  },
  {
    matchName: "Orel",
    data: {
      established: "1931",
      description: "Orel State Medical University is one of the recognized medical universities in Russia known for quality medical education, affordable tuition fees, and practical-oriented learning.",
      historicalBackground: "The university was established to strengthen higher education and medical sciences in Russia.",
      hospitalFacilities: "The university is associated with teaching hospitals, laboratories, simulation centers, clinical departments, and modern healthcare facilities.",
      fees: "325,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "International student-friendly institution",
        "Known for affordable and practical medical education"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Strong clinical exposure",
        "Modern infrastructure and laboratories",
        "Internationally recognized medical degree",
        "Safe and peaceful environment"
      ]
    }
  },
  {
    matchName: "Kemerovo",
    data: {
      established: "1955",
      description: "Kemerovo State Medical University is one of the recognized medical universities in Russia known for quality medical education, experienced faculty, modern infrastructure, and practical clinical training.",
      historicalBackground: "The university was established to improve medical education and healthcare services in the Siberian region of Russia.",
      hospitalFacilities: "The university is associated with teaching hospitals, laboratories, simulation centers, research departments, and advanced clinical facilities.",
      fees: "335,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "International student-friendly environment",
        "Known for practical-oriented medical education"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Strong practical and clinical exposure",
        "Modern infrastructure and laboratories",
        "International student environment",
        "Safe and student-friendly campus"
      ]
    }
  },
  {
    matchName: "Volgograd",
    data: {
      established: "1935",
      description: "Volgograd State Medical University is one of the leading medical universities in Russia known for quality medical education, advanced clinical training, and strong international student presence.",
      historicalBackground: "The university was established to strengthen medical education and healthcare services in Russia.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, research laboratories, simulation centers, and advanced clinical departments.",
      fees: "505,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "Internationally respected medical institution",
        "Strong academic and research environment"
      ],
      whyChoose: [
        "Strong international reputation",
        "Excellent practical and clinical exposure",
        "Modern laboratories and infrastructure",
        "International student-friendly environment",
        "Experienced faculty and research opportunities",
        "Globally recognized medical degree"
      ]
    }
  },
  {
    matchName: "Bashkir",
    data: {
      established: "1932",
      description: "Bashkir State Medical University is one of the leading and most popular medical universities in Russia known for quality medical education, experienced faculty, modern infrastructure, and strong clinical training.",
      historicalBackground: "The university was established to develop medical education and healthcare services in the Bashkortostan region of Russia.",
      hospitalFacilities: "The university has multiple affiliated teaching hospitals, laboratories, simulation centers, research departments, and advanced healthcare facilities.",
      fees: "405,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "Internationally respected medical institution",
        "Strong academic and research reputation"
      ],
      whyChoose: [
        "One of the most popular medical universities in Russia",
        "Affordable tuition fees",
        "Strong practical and clinical exposure",
        "Modern infrastructure and laboratories",
        "International student-friendly environment",
        "Globally recognized medical degree"
      ]
    }
  },
  {
    matchName: "Yaroslavl",
    data: {
      established: "1944",
      description: "Yaroslavl State Medical University is a recognized medical institution in Russia known for quality education, modern infrastructure, experienced faculty, and strong clinical training.",
      historicalBackground: "The university was established to strengthen medical education and healthcare services in Russia.",
      hospitalFacilities: "The university is attached to teaching hospitals, clinical departments, laboratories, simulation centers, and modern healthcare facilities.",
      fees: "350,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved medical university",
        "International student-friendly environment",
        "Known for practical medical education and training"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Strong clinical exposure",
        "Modern infrastructure and labs",
        "Safe and student-friendly environment",
        "International student community"
      ]
    }
  },
  {
    matchName: "Kabardino",
    data: {
      established: "1957",
      description: "Kabardino-Balkarian State University is one of the recognized public universities in Russia offering medical education with quality academic standards, experienced faculty, and affordable fee structure.",
      historicalBackground: "The university was established to promote higher education and scientific development in the Kabardino-Balkaria region of Russia.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare facilities.",
      fees: "334,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized public university",
        "International student-friendly environment",
        "Known for affordable medical education"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Safe and peaceful environment",
        "Multicultural student community",
        "Practical clinical exposure",
        "Recognized medical degree"
      ]
    }
  },
  {
    matchName: "Chechen",
    data: {
      established: "1938",
      description: "Chechen State University is a recognized public university in Russia offering quality higher education including medical and healthcare-related programs.",
      historicalBackground: "The university was established to provide higher education opportunities in the Chechen Republic.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare facilities.",
      fees: "335,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized public university",
        "Recognized by WHO and NMC",
        "Developing international academic presence",
        "Known for affordable education in Russia"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium medical programs",
        "Safe and improving campus environment",
        "Practical clinical exposure",
        "Growing international student community",
        "Recognized medical degree"
      ]
    }
  },
  {
    matchName: "Omsk",
    data: {
      established: "1920",
      description: "Omsk State Medical University is one of the well-established medical universities in Russia known for its quality education, experienced faculty, and strong clinical training.",
      historicalBackground: "The university was established to develop medical education and healthcare services in Siberia.",
      hospitalFacilities: "The university is associated with teaching hospitals, research centers, laboratories, simulation facilities, and advanced clinical departments.",
      fees: "370,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-recognized medical university",
        "International student-friendly environment",
        "Strong focus on clinical and practical training"
      ],
      whyChoose: [
        "Affordable MBBS tuition fees",
        "English-medium medical programs",
        "Strong clinical exposure",
        "Modern infrastructure and laboratories",
        "International student community",
        "Safe and student-friendly environment"
      ]
    }
  },
  {
    matchName: "Sevastopol",
    data: {
      established: "2014",
      description: "Sevastopol State University is a recognized public university in Russia known for its growing academic standards, modern infrastructure, and developing medical and science programs.",
      historicalBackground: "The university was established after the merger of several higher education institutions in Sevastopol to create a modern multidisciplinary university.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare facilities.",
      fees: "294,000 Rubles / Yr",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Government-recognized public university",
        "Recognized by relevant international medical bodies",
        "Developing international student presence",
        "Known for affordable education and modern approach"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "Coastal city environment",
        "English-medium programs",
        "Developing modern infrastructure",
        "Safe and peaceful student life",
        "International student-friendly environment"
      ]
    }
  },

  // --- KYRGYZSTAN ---
  {
    matchName: "Jalal-Abad",
    data: {
      established: "1993",
      description: "Jalal-Abad International University is a recognized medical institution in Kyrgyzstan known for affordable medical education, international student diversity, and practical-oriented learning.",
      historicalBackground: "The university was established to promote higher education in the Jalal-Abad region and gradually expanded its medical faculty.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare training facilities.",
      fees: "3,600 USD per year",
      hostelFees: "Separate hostel facilities are available for boys and girls. Approximate expenses range around 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved university",
        "International student-friendly institution",
        "Known for affordable MBBS programs"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "English-medium MBBS program",
        "Safe and student-friendly environment",
        "Practical clinical exposure",
        "International student community",
        "Easy admission process"
      ]
    }
  },
  {
    matchName: "School of Medicine", // ISM Bishkek
    data: {
      established: "2003",
      description: "International School of Medicine (ISM), Bishkek is one of the most popular medical institutions in Kyrgyzstan for international students. It is well known for English-medium medical education.",
      historicalBackground: "The institution was established to provide international-standard medical education in Kyrgyzstan.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, simulation labs, and affiliated medical centers.",
      fees: "5,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Internationally accepted medical curriculum",
        "Strong reputation among Central Asian medical universities",
        "High number of international students"
      ],
      whyChoose: [
        "One of the most popular MBBS universities in Kyrgyzstan",
        "English-medium education",
        "Strong Indian student community",
        "Affordable education system",
        "Good clinical exposure",
        "Easy admission process"
      ]
    }
  },
  {
    matchName: "Osh State",
    data: {
      established: "1951",
      description: "Osh State University is one of the largest and most reputed public universities in Kyrgyzstan. Its Faculty of International Medicine is highly popular among international students.",
      historicalBackground: "Osh State University was established to provide higher education in southern Kyrgyzstan.",
      hospitalFacilities: "The university is affiliated with teaching hospitals, clinical departments, simulation centers, laboratories, and healthcare facilities.",
      fees: "4,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved public university",
        "One of the most popular MBBS destinations in Kyrgyzstan",
        "Large international student community"
      ],
      whyChoose: [
        "Affordable MBBS fees",
        "English-medium instruction",
        "Strong clinical exposure",
        "Large international student base",
        "Safe student environment",
        "Recognized medical degree"
      ]
    }
  },
  {
    matchName: "Kyrgyz-Uzbek",
    data: {
      established: "2019",
      description: "Kyrgyz-Uzbek Medical University is a recognized medical institution in Kyrgyzstan offering affordable MBBS programs for international students.",
      historicalBackground: "The university was established to strengthen medical education opportunities in Kyrgyzstan, especially for international students from Central Asia and South Asia.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, and simulation centers.",
      fees: "3,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate expenses range between 1,500 USD to 1,800 USD per year.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved medical university",
        "Growing international student intake",
        "Known for affordable MBBS education"
      ],
      whyChoose: [
        "Very affordable tuition fees",
        "English-medium MBBS program",
        "Simple admission process",
        "Multicultural student environment",
        "Practical clinical exposure",
        "Safe and peaceful campus"
      ]
    }
  },

  // --- TAJIKISTAN ---
  {
    matchName: "Avicenna",
    data: {
      established: "1939",
      description: "Avicenna Tajik State Medical University is the leading and most prestigious medical university in Tajikistan. It is well known for its quality medical education and experienced faculty.",
      historicalBackground: "The university was established to develop modern medical education and healthcare services in Tajikistan. Named after the famous Persian physician Avicenna.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, simulation centers, and healthcare facilities.",
      fees: "4,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate hostel and mess expenses are around 180 USD per month.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved medical university",
        "Leading medical institution in Tajikistan",
        "International student-friendly environment"
      ],
      whyChoose: [
        "Top medical university in Tajikistan",
        "Affordable MBBS program",
        "English-medium education",
        "Strong clinical exposure",
        "Safe and student-friendly environment",
        "Recognized medical degree"
      ]
    }
  },
  {
    matchName: "Tajik National", // MISSED PREVIOUSLY - NOW ADDED
    data: {
      established: "1947",
      description: "Tajik National University is one of the oldest and most prestigious higher education institutions in Tajikistan. It offers a wide range of academic programs, including medical fields.",
      historicalBackground: "The university was established to develop higher education and scientific research in Tajikistan.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, research centers, and healthcare facilities.",
      fees: "4,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate hostel and mess expenses are around 150–200 USD per month.",
      recognition: [
        "Recognized by WHO and NMC",
        "Government-approved national university",
        "One of the top universities in Tajikistan",
        "Growing international academic reputation"
      ],
      whyChoose: [
        "One of the oldest universities in Tajikistan",
        "Affordable education",
        "Strong academic reputation",
        "International student-friendly environment",
        "Practical medical exposure",
        "Recognized degree"
      ]
    }
  },
  {
    matchName: "Khatlon",
    data: {
      established: "2016",
      description: "Khatlon State Medical University is a recognized medical institution in Tajikistan known for affordable medical education and growing international student enrollment.",
      historicalBackground: "The university was established to expand higher education opportunities in the Khatlon region and to improve access to medical education.",
      hospitalFacilities: "The university is associated with teaching hospitals, clinical departments, laboratories, and healthcare training facilities.",
      fees: "4,000 USD per year",
      hostelFees: "Separate hostel facilities are available. Approximate hostel and mess expenses are around 150–200 USD per month.",
      recognition: [
        "Government-recognized medical university",
        "Recognized by relevant medical authorities",
        "Developing international student presence",
        "Known for affordable MBBS education"
      ],
      whyChoose: [
        "Affordable tuition fees",
        "Simple admission process",
        "English-medium medical education",
        "Developing infrastructure",
        "Safe and peaceful environment",
        "Growing international student community"
      ]
    }
  }
];

export default function BulkUpdateGlobalPage() {
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);

  const runBulkUpdate = async () => {
    setLoading(true);
    setLogs(["Starting Global Bulk Update Process..."]);
    let updatedCount = 0;

    try {
      // 1. Fetch ALL universities currently in your Firebase database
      const querySnapshot = await getDocs(collection(db, "universities"));
      const updatePromises: Promise<void>[] = [];

      querySnapshot.forEach((docSnap) => {
        const uniData = docSnap.data();
        const firebaseName = uniData.name || "";

        // 2. Smart Match: Check if the Firebase name contains any of our target names
        const match = globalData.find(globalUni => 
          firebaseName.toLowerCase().includes(globalUni.matchName.toLowerCase())
        );

        if (match) {
          // 3. Match found! Queue the update
          const docRef = doc(db, "universities", docSnap.id);
          
          const promise = updateDoc(docRef, match.data).then(() => {
            setLogs(prev => [...prev, `✅ Updated: ${firebaseName}`]);
            updatedCount++;
          });
          
          updatePromises.push(promise);
        }
      });

      // Execute all updates simultaneously
      await Promise.all(updatePromises);
      
      setLogs(prev => [...prev, `🎉 Process Complete! Successfully mapped and updated ${updatedCount} global universities.`]);
      toast.success(`Successfully updated ${updatedCount} universities!`);

    } catch (error) {
      console.error(error);
      setLogs(prev => [...prev, `❌ ERROR: Something went wrong. Check console.`]);
      toast.error("Bulk update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-32 pb-24">
      <div className="container mx-auto px-4 max-w-3xl">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-200">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 flex items-center justify-center rounded-xl">
              <Globe2 className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Global Data Bulk Uploader</h1>
              <p className="text-gray-500 text-sm">Smart match and inject detailed data for Int. universities.</p>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl mb-8 flex gap-3 text-blue-800 text-sm">
            <ShieldAlert className="w-5 h-5 shrink-0" />
            <p>
              This script will scan your database for the global universities in Russia, Egypt, Kazakhstan, Uzbekistan, Kyrgyzstan, and Tajikistan and instantly populate their history, fees, and facilities. <b>Universities without matching data will safely remain untouched.</b>
            </p>
          </div>

          <Button 
            onClick={runBulkUpdate} 
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-6 text-lg rounded-xl mb-8"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin mr-2" /> : null}
            {loading ? "Injecting Database..." : "Execute Global Update Now"}
          </Button>

          {/* Logging Console */}
          <div className="bg-gray-900 rounded-xl p-4 h-64 overflow-y-auto font-mono text-sm">
            {logs.length === 0 ? (
              <p className="text-gray-500">Awaiting execution...</p>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className={log.includes("ERROR") ? "text-red-400" : log.includes("✅") ? "text-green-400" : "text-gray-300"}>
                  {log}
                </div>
              ))
            )}
          </div>

        </div>
      </div>
    </div>
  );
}