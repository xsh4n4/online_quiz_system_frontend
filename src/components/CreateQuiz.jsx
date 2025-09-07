import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CreateQuiz = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Create Quiz</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Quiz creation form will be implemented here.</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateQuiz;

