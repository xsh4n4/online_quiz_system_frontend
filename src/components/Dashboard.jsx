import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../contexts/AuthContext';
import { resultsAPI, quizAPI } from '../lib/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  BookOpen, 
  Trophy, 
  Clock, 
  CheckCircle, 
  TrendingUp,
  Calendar,
  Target,
  Award,
  ArrowRight
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();

  // Fetch user's recent results
  const { data: recentResults, isLoading: resultsLoading } = useQuery({
    queryKey: ['userResults', { limit: 5 }],
    queryFn: () => resultsAPI.getUserResults({ limit: 5 }),
  });

  // Fetch popular quizzes
  const { data: popularQuizzes, isLoading: quizzesLoading } = useQuery({
    queryKey: ['popularQuizzes', { limit: 6 }],
    queryFn: () => quizAPI.getQuizzes({ limit: 6, sortBy: 'totalAttempts' }),
  });

  const stats = [
    {
      title: 'Quizzes Taken',
      value: user?.totalQuizzesTaken || 0,
      icon: BookOpen,
      description: 'Total completed',
    },
    {
      title: 'Average Score',
      value: user?.averageScore ? `${Math.round(user.averageScore)}%` : '0%',
      icon: Target,
      description: 'Across all quizzes',
    },
    {
      title: 'Best Score',
      value: recentResults?.data?.results?.length > 0 
        ? `${Math.max(...recentResults.data.results.map(r => r.percentage))}%`
        : '0%',
      icon: Trophy,
      description: 'Personal best',
    },
    {
      title: 'This Week',
      value: recentResults?.data?.results?.filter(r => {
        const resultDate = new Date(r.completedAt);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return resultDate > weekAgo;
      }).length || 0,
      icon: Calendar,
      description: 'Quizzes completed',
    },
  ];

  const getScoreColor = (percentage) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadgeVariant = (percentage) => {
    if (percentage >= 80) return 'default';
    if (percentage >= 60) return 'secondary';
    return 'destructive';
  };

  if (resultsLoading || quizzesLoading) {
    return <LoadingSpinner text="Loading your dashboard..." />;
  }

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">
          Welcome back, {user?.firstName}!
        </h1>
        <p className="text-muted-foreground">
          Here's an overview of your quiz performance and available challenges.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map(({ title, value, icon: Icon, description }) => (
          <Card key={title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{title}</CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{value}</div>
              <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Recent Results */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Results
                </CardTitle>
                <CardDescription>Your latest quiz attempts</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/profile">View All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {recentResults?.data?.results?.length > 0 ? (
              <div className="space-y-4">
                {recentResults.data.results.map((result) => (
                  <div key={result._id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{result.quiz.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {result.quiz.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(result.completedAt), { addSuffix: true })}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={getScoreBadgeVariant(result.percentage)}>
                        {result.percentage}%
                      </Badge>
                      <div className="text-xs text-muted-foreground mt-1">
                        {result.correctAnswers}/{result.totalQuestions}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quiz results yet</p>
                <Button className="mt-4" asChild>
                  <Link to="/quizzes">Take Your First Quiz</Link>
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recommended Quizzes */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Popular Quizzes
                </CardTitle>
                <CardDescription>Trending challenges to try</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link to="/quizzes">Browse All</Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {popularQuizzes?.data?.quizzes?.length > 0 ? (
              <div className="space-y-4">
                {popularQuizzes.data.quizzes.slice(0, 5).map((quiz) => (
                  <div key={quiz._id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{quiz.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {quiz.category}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {quiz.difficulty}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {quiz.questionCount} questions
                        </span>
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" asChild>
                      <Link to={`/quizzes/${quiz._id}`}>
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No quizzes available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="h-5 w-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Jump into your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
              <Link to="/quizzes">
                <BookOpen className="h-8 w-8" />
                <span className="font-medium">Browse Quizzes</span>
                <span className="text-xs opacity-80">Discover new challenges</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
              <Link to="/leaderboard">
                <Trophy className="h-8 w-8" />
                <span className="font-medium">Leaderboard</span>
                <span className="text-xs opacity-80">See your ranking</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto p-6 flex flex-col items-center space-y-2" asChild>
              <Link to="/profile">
                <Target className="h-8 w-8" />
                <span className="font-medium">View Profile</span>
                <span className="text-xs opacity-80">Track your progress</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

