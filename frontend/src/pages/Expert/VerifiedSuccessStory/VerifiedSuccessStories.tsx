import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { SuccessStoryCardSkeleton } from "@/components/PostCards/PostCardSkeletons";
// import SuccessStoryPostCard from "@/components/PostCards/SuccessStoryPostCard/SuccessStoryPostCard";

interface Doctor {
  name: string;
  avatar: string;
  credentials: string;
}

interface Verification {
  verified: boolean;
  verifiedBy?: Doctor[];
}

interface SuccessStoryPost {
  id: string;
  author: {
    name: string;
    avatar: string;
  };
  title: string;
  content: string;
  image?: string;
  likes: number;
  comments: number;
  readTime: string;
  tags: string[];
  verification: Verification;
  taggedDoctors: Doctor[];
  createdAt: string;
}

export function VerifiedByVaidya() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [stories, setStories] = useState<SuccessStoryPost[]>([]);
  const [filteredStories, setFilteredStories] = useState<SuccessStoryPost[]>(
    []
  );

  // Mock data for the currently logged-in expert
  const currentExpert = {
    name: "Dr. Priya Sharma",
    avatar: "https://images.unsplash.com/photo-1594824476967-48c8b964273f",
    credentials: "PhD in Ayurveda",
  };

  useEffect(() => {
    // Simulate API fetch
    const fetchVerifiedStories = async () => {
      setIsLoading(true);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Mock data - stories verified by current expert
        const mockStories: SuccessStoryPost[] = [
          {
            id: "1",
            author: {
              name: "Rahul Mehta",
              avatar:
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d",
            },
            title: "Reversing PCOS with Ayurveda",
            content:
              "After years of struggling with PCOS symptoms, Ayurveda helped me regain balance. Following Dr. Sharma's recommendations for diet and lifestyle changes transformed my health completely within 6 months.",
            image:
              "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
            likes: 215,
            comments: 78,
            readTime: "7 min read",
            tags: ["PCOS", "Women Health", "Success"],
            verification: {
              verified: true,
              verifiedBy: [currentExpert],
            },
            taggedDoctors: [
              currentExpert,
              {
                name: "Dr. Anjali Deshpande",
                avatar:
                  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
                credentials: "BAMS, Women's Health",
              },
            ],
            createdAt: "2023-04-10",
          },
          {
            id: "2",
            author: {
              name: "Sunita Rao",
              avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            },
            title: "Managing Diabetes Naturally",
            content:
              "Dr. Sharma's personalized Ayurvedic protocol helped me reduce my HbA1c from 8.5 to 6.2 without relying solely on medication. The herbal supplements and dietary changes made all the difference.",
            image:
              "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
            likes: 187,
            comments: 42,
            readTime: "6 min read",
            tags: ["Diabetes", "Success", "Ayurvedic Treatment"],
            verification: {
              verified: true,
              verifiedBy: [
                {
                  name: "Dr. Rajesh Verma",
                  avatar:
                    "https://images.unsplash.com/photo-1622253692010-333f2da6031d",
                  credentials: "Panchakarma Specialist",
                },
                currentExpert,
              ],
            },
            taggedDoctors: [currentExpert],
            createdAt: "2023-07-18",
          },
          {
            id: "3",
            author: {
              name: "Priya Singh",
              avatar:
                "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2",
            },
            title: "Healing Digestive Disorders",
            content:
              "Years of IBS were resolved through Dr. Sharma's Ayurvedic treatment plan focusing on Pitta pacification and gut healing herbs.",
            image:
              "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2",
            likes: 132,
            comments: 28,
            readTime: "4 min read",
            tags: ["Digestion", "IBS", "Pitta"],
            verification: {
              verified: true,
              verifiedBy: [currentExpert],
            },
            taggedDoctors: [currentExpert],
            createdAt: "2023-08-22",
          },
        ];

        // Filter stories where current expert is in verifiedBy array
        const verifiedStories = mockStories.filter(
          (story) =>
            story.verification.verified &&
            story.verification.verifiedBy?.some(
              (doctor) => doctor.name === currentExpert.name
            )
        );

        setStories(verifiedStories);
        setFilteredStories(verifiedStories);
      } catch (error) {
        console.error("Error fetching verified stories:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVerifiedStories();
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredStories(stories);
    } else {
      const filtered = stories.filter(
        (story) =>
          story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          story.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
      setFilteredStories(filtered);
    }
  }, [searchQuery, stories]);

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
              Stories Verified By You
            </h1>
            <p className="text-gray-600 mt-2">
              Success stories you have personally verified
            </p>
          </div>

          <div className="relative w-full md:w-96">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verified stories..."
              className="pl-10 pr-4 py-2 rounded-lg border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          </div>
        </div>

        <AnimatePresence>
          {isLoading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid gap-6"
            >
              {[1, 2, 3].map((i) => (
                <SuccessStoryCardSkeleton key={i} />
              ))}
            </motion.div>
          ) : filteredStories.length > 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="grid gap-6"
            >
              {filteredStories.map((story) => (
                <motion.div
                  key={story.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* <SuccessStoryPostCard post={story as any} /> */}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-12"
            >
              <div className="text-center max-w-md">
                <h3 className="text-xl font-medium text-gray-800 mb-2">
                  No verified stories found
                </h3>
                <p className="text-gray-600">
                  {searchQuery.trim() === ""
                    ? "You haven't verified any success stories yet."
                    : "No verified stories match your search query."}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
