import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  BookOpen, 
  Trophy, 
  Users, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  Star,
  Target,
  Zap
} from 'lucide-react';

const Home = () => {
  const { isAuthenticated } = useAuth();

  const features = [
    {
      icon: BookOpen,
      title: 'Interactive Quizzes',
      description: 'Take engaging quizzes across various categories and difficulty levels.',
    },
    {
      icon: Clock,
      title: 'Timed Challenges',
      description: 'Test your knowledge under pressure with time-limited quizzes.',
    },
    {
      icon: Trophy,
      title: 'Leaderboards',
      description: 'Compete with others and see how you rank on global and quiz-specific leaderboards.',
    },
    {
      icon: Target,
      title: 'Track Progress',
      description: 'Monitor your performance and improvement over time with detailed analytics.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Join a community of learners and challenge yourself with others.',
    },
    {
      icon: Zap,
      title: 'Instant Results',
      description: 'Get immediate feedback and explanations for your answers.',
    },
  ];

  const stats = [
    { label: 'Active Users', value: '10,000+', icon: Users },
    { label: 'Quizzes Available', value: '500+', icon: BookOpen },
    { label: 'Questions Answered', value: '1M+', icon: CheckCircle },
    { label: 'Average Rating', value: '4.8/5', icon: Star },
  ];

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground">
            Master Your Knowledge with{' '}
            <span className="text-primary">QuizMaster</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Challenge yourself with interactive quizzes, compete on leaderboards, 
            and track your progress in a fun and engaging learning environment.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <>
              <Button size="lg" asChild>
                <Link to="/dashboard">
                  Go to Dashboard
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/quizzes">Browse Quizzes</Link>
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">
                  Get Started Free
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/quizzes">Browse Quizzes</Link>
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Stats Section */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map(({ label, value, icon: Icon }) => (
          <Card key={label} className="text-center">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-2">
                <Icon className="h-8 w-8 text-primary" />
                <div className="text-2xl font-bold text-foreground">{value}</div>
                <div className="text-sm text-muted-foreground">{label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </section>

      {/* Features Section */}
      <section className="space-y-8">
        <div className="text-center space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Why Choose QuizMaster?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover the features that make QuizMaster the perfect platform 
            for testing and improving your knowledge.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map(({ icon: Icon, title, description }) => (
            <Card key={title} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 p-2 rounded-lg">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary/5 rounded-lg p-8 md:p-12 text-center space-y-6">
        <div className="space-y-4">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground">
            Ready to Test Your Knowledge?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of learners who are already improving their skills 
            with QuizMaster. Start your journey today!
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isAuthenticated ? (
            <Button size="lg" asChild>
              <Link to="/quizzes">
                Start Taking Quizzes
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          ) : (
            <>
              <Button size="lg" asChild>
                <Link to="/register">
                  Sign Up Now
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

