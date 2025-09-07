import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Search, 
  Clock, 
  Users, 
  BookOpen, 
  Filter,
  ArrowRight,
  Star,
  Trophy
} from 'lucide-react';

const QuizList = () => {
  const { isAuthenticated } = useAuth();
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    difficulty: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [page, setPage] = useState(1);

  // Fetch quizzes
  const { data: quizzesData, isLoading } = useQuery({
    queryKey: ['quizzes', filters, page],
    queryFn: () => quizAPI.getQuizzes({ ...filters, page, limit: 12 }),
  });

  // Fetch categories
  const { data: categoriesData } = useQuery({
    queryKey: ['categories'],
    queryFn: () => quizAPI.getCategories(),
  });

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    // Search is already handled by the query key dependency
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading quizzes..." />;
  }

  const quizzes = quizzesData?.data?.quizzes || [];
  const pagination = quizzesData?.data?.pagination || {};
  const categories = categoriesData?.data?.categories || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Explore Quizzes</h1>
        <p className="text-muted-foreground">
          Discover and take quizzes across various topics and difficulty levels.
        </p>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search quizzes..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange('search', e.target.value)}
                  className="pl-10"
                />
              </div>
            </form>

            {/* Category */}
            <Select value={filters.category} onValueChange={(value) => handleFilterChange('category', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Difficulty */}
            <Select value={filters.difficulty} onValueChange={(value) => handleFilterChange('difficulty', value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Levels</SelectItem>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={`${filters.sortBy}-${filters.sortOrder}`} onValueChange={(value) => {
              const [sortBy, sortOrder] = value.split('-');
              setFilters(prev => ({ ...prev, sortBy, sortOrder }));
              setPage(1);
            }}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="title-asc">Title A-Z</SelectItem>
                <SelectItem value="title-desc">Title Z-A</SelectItem>
                <SelectItem value="totalAttempts-desc">Most Popular</SelectItem>
                <SelectItem value="averageScore-desc">Highest Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {quizzes.length > 0 ? (
        <>
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {((pagination.current - 1) * 12) + 1} to {Math.min(pagination.current * 12, pagination.total)} of {pagination.total} quizzes
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quizzes.map((quiz) => (
              <Card key={quiz._id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="space-y-1 flex-1">
                      <CardTitle className="text-lg line-clamp-2">{quiz.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {quiz.description || 'No description available'}
                      </CardDescription>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 flex-wrap">
                    <Badge variant="outline">{quiz.category}</Badge>
                    <Badge className={getDifficultyColor(quiz.difficulty)}>
                      {quiz.difficulty}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    {/* Quiz Stats */}
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.questionCount} questions</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.totalAttempts || 0} attempts</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-muted-foreground" />
                        <span>{quiz.averageScore ? `${Math.round(quiz.averageScore)}%` : 'N/A'}</span>
                      </div>
                    </div>

                    {/* User Progress */}
                    {isAuthenticated && quiz.userAttempts > 0 && (
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Your best score:</span>
                          <div className="flex items-center gap-1">
                            <Trophy className="h-4 w-4 text-yellow-500" />
                            <span className="font-medium">{quiz.userBestScore}%</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Action Button */}
                    <Button className="w-full" asChild>
                      <Link to={`/quizzes/${quiz._id}`}>
                        {isAuthenticated ? (
                          quiz.userAttempts > 0 ? 'Retake Quiz' : 'Take Quiz'
                        ) : (
                          'View Quiz'
                        )}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex items-center justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setPage(page - 1)}
                disabled={!pagination.hasPrev}
              >
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                  const pageNum = Math.max(1, Math.min(pagination.pages - 4, page - 2)) + i;
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setPage(pageNum)}
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => setPage(page + 1)}
                disabled={!pagination.hasNext}
              >
                Next
              </Button>
            </div>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No quizzes found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search terms.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setFilters({
                  search: '',
                  category: '',
                  difficulty: '',
                  sortBy: 'createdAt',
                  sortOrder: 'desc',
                });
                setPage(1);
              }}
            >
              Clear Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizList;

