import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageSquare, 
  Plus, 
  Send, 
  User, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Search,
  Filter,
  BookOpen,
  Coffee,
  FileText,
  Users,
  Building,
  Globe,
  ArrowLeft,
  Heart,
  MessageCircle,
  Share2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { RealtimeService } from '../services/supabaseService';

interface ForumCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

interface ForumPost {
  id: string;
  title: string;
  content: string;
  category_id: string;
  user_id: string;
  user_name: string;
  created_at: Date;
  comments: ForumComment[];
  likes: number;
  isExpanded?: boolean;
  isLiked?: boolean;
}

interface ForumComment {
  id: string;
  post_id: string;
  content: string;
  user_id: string;
  user_name: string;
  created_at: Date;
}

interface ForumProps {
  isDarkMode: boolean;
  onBack?: () => void;
}

const Forum: React.FC<ForumProps> = ({ isDarkMode, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const [newPost, setNewPost] = useState({ title: '', content: '', category_id: '' });
  const [newComment, setNewComment] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const { t, language } = useLanguage();
  const { user } = useAuth();

  const categories: ForumCategory[] = [
    {
      id: 'all',
      name: language === 'en' ? 'All Topics' : 'Alle Themen',
      icon: <MessageSquare className="w-5 h-5" />,
      color: 'bg-gray-500',
      description: language === 'en' ? 'View all forum posts' : 'Alle Forum-Beiträge anzeigen'
    },
    {
      id: 'library',
      name: language === 'en' ? 'Library' : 'Bibliothek',
      icon: <BookOpen className="w-5 h-5" />,
      color: 'bg-blue-500',
      description: language === 'en' ? 'Questions about library services' : 'Fragen zu Bibliotheksdiensten'
    },
    {
      id: 'cafeteria',
      name: language === 'en' ? 'Cafeteria' : 'Cafeteria',
      icon: <Coffee className="w-5 h-5" />,
      color: 'bg-red-500',
      description: language === 'en' ? 'Dining and food-related discussions' : 'Diskussionen über Essen und Gastronomie'
    },
    {
      id: 'visa-services',
      name: language === 'en' ? 'Visa Services' : 'Visa-Services',
      icon: <FileText className="w-5 h-5" />,
      color: 'bg-orange-500',
      description: language === 'en' ? 'Immigration and visa help' : 'Einwanderungs- und Visa-Hilfe'
    },
    {
      id: 'student-center',
      name: language === 'en' ? 'Student Life' : 'Studentenleben',
      icon: <Users className="w-5 h-5" />,
      color: 'bg-pink-500',
      description: language === 'en' ? 'Student activities and organizations' : 'Studentische Aktivitäten und Organisationen'
    },
    {
      id: 'administration',
      name: language === 'en' ? 'Administration' : 'Verwaltung',
      icon: <Building className="w-5 h-5" />,
      color: 'bg-green-500',
      description: language === 'en' ? 'Administrative procedures and help' : 'Verwaltungsverfahren und Hilfe'
    },
    {
      id: 'international',
      name: language === 'en' ? 'International' : 'International',
      icon: <Globe className="w-5 h-5" />,
      color: 'bg-purple-500',
      description: language === 'en' ? 'International student support' : 'Unterstützung für internationale Studierende'
    }
  ];

  // Load posts and set up real-time subscription
  useEffect(() => {
    loadPosts();
    
    // Set up real-time subscription for new posts/comments
    const channel = RealtimeService.subscribeToEvents((payload) => {
      console.log('Real-time update:', payload);
      // Handle real-time updates here
      loadPosts();
    });

    return () => {
      RealtimeService.unsubscribe(channel);
    };
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      // In a real implementation, you would fetch from your forum posts table
      // For now, we'll use mock data that simulates real forum posts
      const mockPosts: ForumPost[] = [
        {
          id: '1',
          title: language === 'en' ? 'How to book study rooms in the library?' : 'Wie kann ich Lernräume in der Bibliothek buchen?',
          content: language === 'en' 
            ? 'I\'m new to UDE and I need to book a study room for my group project. Can someone guide me through the process? I\'ve tried looking online but the process seems confusing.'
            : 'Ich bin neu an der UDE und muss einen Lernraum für mein Gruppenprojekt buchen. Kann mir jemand durch den Prozess helfen? Ich habe online gesucht, aber der Prozess scheint verwirrend.',
          category_id: 'library',
          user_id: '1',
          user_name: 'Sarah M.',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 5,
          comments: [
            {
              id: '1',
              post_id: '1',
              content: language === 'en'
                ? 'You can book study rooms online through the library portal. Just go to the library website and look for "Room Booking". You\'ll need your student ID to log in.'
                : 'Sie können Lernräume online über das Bibliotheksportal buchen. Gehen Sie einfach auf die Bibliotheks-Website und suchen Sie nach "Raumbuchung". Sie benötigen Ihre Studierenden-ID zum Einloggen.',
              user_id: '2',
              user_name: 'Alex K.',
              created_at: new Date(Date.now() - 1 * 60 * 60 * 1000)
            },
            {
              id: '2',
              post_id: '1',
              content: language === 'en'
                ? 'Also, book early! Popular time slots fill up quickly, especially during exam periods.'
                : 'Buchen Sie auch früh! Beliebte Zeitfenster sind schnell ausgebucht, besonders während der Prüfungszeiten.',
              user_id: '3',
              user_name: 'Maria L.',
              created_at: new Date(Date.now() - 30 * 60 * 1000)
            }
          ]
        },
        {
          id: '2',
          title: language === 'en' ? 'Best vegetarian options in cafeteria?' : 'Beste vegetarische Optionen in der Cafeteria?',
          content: language === 'en'
            ? 'I\'m looking for good vegetarian meals on campus. What are your recommendations? I\'m particularly interested in protein-rich options.'
            : 'Ich suche nach guten vegetarischen Mahlzeiten auf dem Campus. Was sind eure Empfehlungen? Ich interessiere mich besonders für proteinreiche Optionen.',
          category_id: 'cafeteria',
          user_id: '3',
          user_name: 'Maria L.',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 8,
          comments: [
            {
              id: '3',
              post_id: '2',
              content: language === 'en'
                ? 'The pasta station usually has great vegetarian options, and they clearly mark all vegan dishes! The lentil curry is amazing.'
                : 'Die Pasta-Station hat normalerweise tolle vegetarische Optionen, und sie kennzeichnen alle veganen Gerichte deutlich! Das Linsen-Curry ist fantastisch.',
              user_id: '4',
              user_name: 'Tom R.',
              created_at: new Date(Date.now() - 3 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: '3',
          title: language === 'en' ? 'Visa extension process - need help!' : 'Visa-Verlängerungsprozess - brauche Hilfe!',
          content: language === 'en'
            ? 'My student visa expires in 2 months. What documents do I need for extension? Any tips for the appointment? I\'m quite nervous about the process.'
            : 'Mein Studentenvisum läuft in 2 Monaten ab. Welche Dokumente brauche ich für die Verlängerung? Tipps für den Termin? Ich bin ziemlich nervös wegen des Prozesses.',
          category_id: 'visa-services',
          user_id: '5',
          user_name: 'Ahmed S.',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000),
          likes: 12,
          comments: [
            {
              id: '4',
              post_id: '3',
              content: language === 'en'
                ? 'Make sure you have your enrollment certificate, bank statements (last 3 months), and health insurance. Book the appointment early! The staff is usually very helpful.'
                : 'Stellen Sie sicher, dass Sie Ihre Immatrikulationsbescheinigung, Kontoauszüge (letzte 3 Monate) und Krankenversicherung haben. Buchen Sie den Termin früh! Das Personal ist normalerweise sehr hilfsbereit.',
              user_id: '6',
              user_name: 'Lisa W.',
              created_at: new Date(Date.now() - 5 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: '4',
          title: language === 'en' ? 'Study groups for Computer Science?' : 'Lerngruppen für Informatik?',
          content: language === 'en'
            ? 'Looking for study partners for CS courses, especially algorithms and data structures. Anyone interested in forming a study group?'
            : 'Suche Lernpartner für Informatik-Kurse, besonders Algorithmen und Datenstrukturen. Jemand interessiert an einer Lerngruppe?',
          category_id: 'student-center',
          user_id: '7',
          user_name: 'David K.',
          created_at: new Date(Date.now() - 8 * 60 * 60 * 1000),
          likes: 6,
          comments: []
        },
        {
          id: '5',
          title: language === 'en' ? 'WhatsApp and Discord groups for UDE students' : 'WhatsApp und Discord Gruppen für UDE Studierende',
          content: language === 'en'
            ? 'Hey everyone! I found some great communication channels for UDE students. Join our WhatsApp group for quick updates and our Discord server for study sessions and casual chat!'
            : 'Hallo alle! Ich habe einige großartige Kommunikationskanäle für UDE-Studierende gefunden. Tretet unserer WhatsApp-Gruppe für schnelle Updates und unserem Discord-Server für Lernsitzungen und lockere Gespräche bei!',
          category_id: 'student-center',
          user_id: '8',
          user_name: 'Emma S.',
          created_at: new Date(Date.now() - 12 * 60 * 60 * 1000),
          likes: 15,
          comments: [
            {
              id: '5',
              post_id: '5',
              content: language === 'en'
                ? 'Great initiative! These groups are super helpful for staying connected with fellow students.'
                : 'Tolle Initiative! Diese Gruppen sind super hilfreich, um mit anderen Studierenden in Kontakt zu bleiben.',
              user_id: '9',
              user_name: 'Max B.',
              created_at: new Date(Date.now() - 10 * 60 * 60 * 1000)
            }
          ]
        }
      ];

      setPosts(mockPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post => {
    const matchesCategory = selectedCategory === 'all' || post.category_id === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCreatePost = async () => {
    if (!newPost.title || !newPost.content || !newPost.category_id || !user) return;

    const post: ForumPost = {
      id: Date.now().toString(),
      title: newPost.title,
      content: newPost.content,
      category_id: newPost.category_id,
      user_id: user.id,
      user_name: user.name,
      created_at: new Date(),
      likes: 0,
      comments: []
    };

    setPosts(prev => [post, ...prev]);
    setNewPost({ title: '', content: '', category_id: '' });
    setShowNewPostForm(false);

    // In a real implementation, you would save to Supabase here
    // await ForumService.createPost(post);
  };

  const handleAddComment = async (postId: string) => {
    const commentText = newComment[postId];
    if (!commentText || !user) return;

    const comment: ForumComment = {
      id: Date.now().toString(),
      post_id: postId,
      content: commentText,
      user_id: user.id,
      user_name: user.name,
      created_at: new Date()
    };

    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, comments: [...post.comments, comment] }
        : post
    ));

    setNewComment(prev => ({ ...prev, [postId]: '' }));

    // In a real implementation, you would save to Supabase here
    // await ForumService.addComment(comment);
  };

  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            likes: post.isLiked ? post.likes - 1 : post.likes + 1,
            isLiked: !post.isLiked 
          }
        : post
    ));
  };

  const togglePostExpansion = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { ...post, isExpanded: !post.isExpanded }
        : post
    ));
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return language === 'en' ? `${diffInMinutes}m ago` : `vor ${diffInMinutes}m`;
    } else if (diffInMinutes < 1440) {
      const hours = Math.floor(diffInMinutes / 60);
      return language === 'en' ? `${hours}h ago` : `vor ${hours}h`;
    } else {
      const days = Math.floor(diffInMinutes / 1440);
      return language === 'en' ? `${days}d ago` : `vor ${days}d`;
    }
  };

  if (loading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${
        isDarkMode 
          ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
          : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
      }`}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900' 
        : 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50'
    } p-4 md:p-6`}>
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          {onBack && (
            <div className="flex items-center mb-4">
              <button
                onClick={onBack}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-colors ${
                  isDarkMode ? 'hover:bg-gray-800 text-gray-300' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                <ArrowLeft className="w-5 h-5" />
                <span>{language === 'en' ? 'Back' : 'Zurück'}</span>
              </button>
            </div>
          )}
          
          <h1 className={`text-3xl md:text-4xl font-bold mb-4 ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>
            {language === 'en' ? 'UDE Student Forum' : 'UDE Studierenden-Forum'}
          </h1>
          <p className={`text-base md:text-lg ${
            isDarkMode ? 'text-gray-300' : 'text-gray-600'
          }`}>
            {language === 'en' 
              ? 'Ask questions, share experiences, and help fellow students'
              : 'Stellen Sie Fragen, teilen Sie Erfahrungen und helfen Sie anderen Studierenden'
            }
          </p>
        </motion.div>

        {/* Controls */}
        <div className="flex flex-col gap-4 mb-8">
          {/* Search */}
          <div className="relative">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 ${
              isDarkMode ? 'text-gray-400' : 'text-gray-500'
            }`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? 'Search posts...' : 'Beiträge durchsuchen...'}
              className={`w-full pl-10 pr-4 py-3 rounded-xl border ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-600 text-white placeholder-gray-400' 
                  : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            />
          </div>

          {/* Categories and New Post Button */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 flex flex-wrap gap-2">
              {categories.map(category => (
                <motion.button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl transition-all text-sm ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white shadow-lg'
                      : isDarkMode
                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                        : 'bg-white text-gray-700 hover:bg-gray-50 shadow-sm'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  title={category.description}
                >
                  {category.icon}
                  <span className="font-medium hidden sm:inline">{category.name}</span>
                </motion.button>
              ))}
            </div>

            <motion.button
              onClick={() => setShowNewPostForm(true)}
              className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-5 h-5" />
              <span className="font-medium">
                {language === 'en' ? 'New Post' : 'Neuer Beitrag'}
              </span>
            </motion.button>
          </div>
        </div>

        {/* New Post Form */}
        <AnimatePresence>
          {showNewPostForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={`mb-8 p-6 rounded-xl ${
                isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
              } backdrop-blur-sm border ${
                isDarkMode ? 'border-gray-700' : 'border-gray-200'
              } shadow-lg`}
            >
              <h3 className={`text-xl font-semibold mb-4 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>
                {language === 'en' ? 'Create New Post' : 'Neuen Beitrag erstellen'}
              </h3>
              
              <div className="space-y-4">
                <select
                  value={newPost.category_id}
                  onChange={(e) => setNewPost(prev => ({ ...prev, category_id: e.target.value }))}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white' 
                      : 'bg-white border-gray-300 text-gray-800'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">
                    {language === 'en' ? 'Select Category' : 'Kategorie auswählen'}
                  </option>
                  {categories.filter(cat => cat.id !== 'all').map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>

                <input
                  type="text"
                  value={newPost.title}
                  onChange={(e) => setNewPost(prev => ({ ...prev, title: e.target.value }))}
                  placeholder={language === 'en' ? 'Post title...' : 'Beitragstitel...'}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <textarea
                  value={newPost.content}
                  onChange={(e) => setNewPost(prev => ({ ...prev, content: e.target.value }))}
                  placeholder={language === 'en' ? 'Write your question or message...' : 'Schreiben Sie Ihre Frage oder Nachricht...'}
                  rows={4}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    isDarkMode 
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                      : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                  } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />

                <div className="flex space-x-3">
                  <button
                    onClick={handleCreatePost}
                    disabled={!newPost.title || !newPost.content || !newPost.category_id}
                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {language === 'en' ? 'Post' : 'Veröffentlichen'}
                  </button>
                  <button
                    onClick={() => setShowNewPostForm(false)}
                    className={`px-6 py-2 rounded-xl transition-colors ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                  >
                    {language === 'en' ? 'Cancel' : 'Abbrechen'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Posts */}
        <div className="space-y-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-12">
              <MessageSquare className={`w-16 h-16 mx-auto mb-4 ${
                isDarkMode ? 'text-gray-600' : 'text-gray-400'
              }`} />
              <p className={`text-lg ${
                isDarkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {language === 'en' ? 'No posts found' : 'Keine Beiträge gefunden'}
              </p>
            </div>
          ) : (
            filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className={`p-6 rounded-xl ${
                  isDarkMode ? 'bg-gray-800/50' : 'bg-white/80'
                } backdrop-blur-sm border ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                } shadow-lg`}
              >
                {/* Post Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className={`font-semibold ${
                        isDarkMode ? 'text-white' : 'text-gray-800'
                      }`}>
                        {post.user_name}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm">
                        <Clock className="w-3 h-3" />
                        <span className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>
                          {formatTimeAgo(post.created_at)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          categories.find(cat => cat.id === post.category_id)?.color || 'bg-gray-500'
                        } text-white`}>
                          {categories.find(cat => cat.id === post.category_id)?.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Content */}
                <div className="mb-4">
                  <h2 className={`text-xl font-semibold mb-2 ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    {post.title}
                  </h2>
                  <p className={`${
                    isDarkMode ? 'text-gray-300' : 'text-gray-700'
                  } leading-relaxed`}>
                    {post.content}
                  </p>
                </div>

                {/* Post Actions */}
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleLikePost(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        post.isLiked
                          ? 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                          : isDarkMode
                            ? 'hover:bg-gray-700 text-gray-400'
                            : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-current' : ''}`} />
                      <span className="text-sm">{post.likes}</span>
                    </button>

                    <button
                      onClick={() => togglePostExpansion(post.id)}
                      className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                        isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                      }`}
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span className="text-sm">{post.comments.length}</span>
                      {post.isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  <button
                    className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors ${
                      isDarkMode ? 'hover:bg-gray-700 text-gray-400' : 'hover:bg-gray-100 text-gray-600'
                    }`}
                  >
                    <Share2 className="w-4 h-4" />
                    <span className="text-sm">{language === 'en' ? 'Share' : 'Teilen'}</span>
                  </button>
                </div>

                {/* Comments Section */}
                <AnimatePresence>
                  {post.isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="mt-4 space-y-4 border-t pt-4"
                    >
                      {/* Existing Comments */}
                      {post.comments.map(comment => (
                        <motion.div 
                          key={comment.id} 
                          className={`p-4 rounded-lg ${
                            isDarkMode ? 'bg-gray-700/30' : 'bg-gray-50'
                          }`}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                        >
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-6 h-6 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                              <User className="w-3 h-3 text-white" />
                            </div>
                            <span className={`font-medium text-sm ${
                              isDarkMode ? 'text-gray-300' : 'text-gray-700'
                            }`}>
                              {comment.user_name}
                            </span>
                            <span className={`text-xs ${
                              isDarkMode ? 'text-gray-500' : 'text-gray-500'
                            }`}>
                              {formatTimeAgo(comment.created_at)}
                            </span>
                          </div>
                          <p className={`text-sm ${
                            isDarkMode ? 'text-gray-300' : 'text-gray-700'
                          }`}>
                            {comment.content}
                          </p>
                        </motion.div>
                      ))}

                      {/* New Comment Form */}
                      <div className="flex space-x-3">
                        <input
                          type="text"
                          value={newComment[post.id] || ''}
                          onChange={(e) => setNewComment(prev => ({ ...prev, [post.id]: e.target.value }))}
                          placeholder={language === 'en' ? 'Write a reply...' : 'Antwort schreiben...'}
                          className={`flex-1 px-4 py-2 rounded-lg border ${
                            isDarkMode 
                              ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400' 
                              : 'bg-white border-gray-300 text-gray-800 placeholder-gray-500'
                          } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                          onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                        />
                        <button
                          onClick={() => handleAddComment(post.id)}
                          disabled={!newComment[post.id]}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Forum;