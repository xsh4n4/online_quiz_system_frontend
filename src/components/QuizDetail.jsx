import React from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { quizAPI } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Clock, 
  Users, 
  BookOpen, 
  Trophy, 
  Star,
  Calendar,
  User,
  Play,
  Lock,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const QuizDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const { data: quizData, isLoading, error } = useQuery({
    queryKey: ['quiz', id],
    queryFn: () => quizAPI.getQuiz(id),
  });

  const handleStartQuiz = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate(`/quiz/${id}/take`);
  };

  if (isLoading) {
    return <LoadingSpinner text="Loading quiz details..." />;
  }

  if (error) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Quiz not found</h3>
          <p className="text-muted-foreground mb-4">
            The quiz you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/quizzes">Browse Other Quizzes</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const quiz = quizData?.data?.quiz;
  if (!quiz) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const canTakeQuiz = isAuthenticated && (quiz.canAttempt !== false);
  const hasAttempted = quiz.userAttempts > 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Link to="/quizzes" className="hover:text-foreground">Quizzes</Link>
          <span>/</span>
          <span>{quiz.title}</span>
        </div>

        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-foreground">{quiz.title}</h1>
          
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="outline">{quiz.category}</Badge>
            <Badge className={getDifficultyColor(quiz.difficulty)}>
              {quiz.difficulty}
            </Badge>
            {quiz.tags?.map((tag) => (
              <Badge key={tag} variant="secondary">{tag}</Badge>
            ))}
          </div>

          {quiz.description && (
            <p className="text-muted-foreground text-lg">{quiz.description}</p>
          )}
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Info */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <BookOpen className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{quiz.questionCount}</div>
                  <div className="text-sm text-muted-foreground">Questions</div>
                </div>
                <div className="text-center">
                  <Clock className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{quiz.timeLimit}</div>
                  <div className="text-sm text-muted-foreground">Minutes</div>
                </div>
                <div className="text-center">
                  <Users className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">{quiz.totalAttempts || 0}</div>
                  <div className="text-sm text-muted-foreground">Attempts</div>
                </div>
                <div className="text-center">
                  <Star className="h-8 w-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold">
                    {quiz.averageScore ? `${Math.round(quiz.averageScore)}%` : 'N/A'}
                  </div>
                  <div className="text-sm text-muted-foreground">Avg Score</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quiz Rules */}
          <Card>
            <CardHeader>
              <CardTitle>Quiz Rules</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Time Limit</div>
                  <div className="text-sm text-muted-foreground">
                    {quiz.isTimeLimited 
                      ? `You have ${quiz.timeLimit} minutes to complete this quiz.`
                      : 'No time limit for this quiz.'
                    }
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Trophy className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Passing Score</div>
                  <div className="text-sm text-muted-foreground">
                    You need {quiz.passingScore}% to pass this quiz.
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <div className="font-medium">Attempts</div>
                  <div className="text-sm text-muted-foreground">
                    You can attempt this quiz up to {quiz.maxAttempts} time{quiz.maxAttempts > 1 ? 's' : ''}.
                  </div>
                </div>
              </div>

              {quiz.shuffleQuestions && (
                <div className="flex items-start gap-3">
                  <BookOpen className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">Question Order</div>
                    <div className="text-sm text-muted-foreground">
                      Questions will be presented in random order.
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Creator Info */}
          <Card>
            <CardHeader>
              <CardTitle>Created By</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 p-2 rounded-full">
                  <User className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <div className="font-medium">
                    {quiz.createdBy?.firstName} {quiz.createdBy?.lastName}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    @{quiz.createdBy?.username}
                  </div>
                </div>
              </div>
              <div className="mt-3 text-sm text-muted-foreground">
                Created {formatDistanceToNow(new Date(quiz.createdAt), { addSuffix: true })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Take Quiz Card */}
          <Card>
            <CardHeader>
              <CardTitle>Take This Quiz</CardTitle>
              {hasAttempted && (
                <CardDescription>
                  You've attempted this quiz {quiz.userAttempts} time{quiz.userAttempts > 1 ? 's' : ''}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* User Progress */}
              {isAuthenticated && hasAttempted && (
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Your Best Score</span>
                    <div className="flex items-center gap-1">
                      <Trophy className="h-4 w-4 text-yellow-500" />
                      <span className="font-bold">{quiz.userBestScore}%</span>
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {quiz.userAttempts}/{quiz.maxAttempts} attempts used
                  </div>
                </div>
              )}

              {/* Warnings */}
              {!canTakeQuiz && isAuthenticated && (
                <Alert>
                  <Lock className="h-4 w-4" />
                  <AlertDescription>
                    You have reached the maximum number of attempts for this quiz.
                  </AlertDescription>
                </Alert>
              )}

              {/* Action Button */}
              <Button 
                className="w-full" 
                onClick={handleStartQuiz}
                disabled={!canTakeQuiz && isAuthenticated}
              >
                {!isAuthenticated ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    Login to Take Quiz
                  </>
                ) : !canTakeQuiz ? (
                  <>
                    <Lock className="mr-2 h-4 w-4" />
                    No Attempts Left
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    {hasAttempted ? 'Retake Quiz' : 'Start Quiz'}
                  </>
                )}
              </Button>

              {!isAuthenticated && (
                <p className="text-xs text-muted-foreground text-center">
                  <Link to="/register" className="text-primary hover:underline">
                    Create an account
                  </Link>{' '}
                  to track your progress and compete on leaderboards.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Leaderboard Preview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="h-5 w-5" />
                Leaderboard
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  See how you rank against other participants
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/leaderboard?quiz=${quiz._id}`}>
                    View Full Leaderboard
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Related Quizzes */}
          <Card>
            <CardHeader>
              <CardTitle>More in {quiz.category}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-4">
                  Explore more quizzes in this category
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to={`/quizzes?category=${encodeURIComponent(quiz.category)}`}>
                    Browse {quiz.category}
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default QuizDetail;

