import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  PlusCircle, 
  Trash2, 
  Save, 
  Eye, 
  Calendar as CalendarIcon,
  Clock,
  Settings,
  ArrowUp,
  ArrowDown,
  Copy,
  CheckCircle,
  XCircle,
  Type,
  List,
  ToggleLeft,
  Edit,
  FileText
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface Question {
  id: string;
  type: 'MULTIPLE_CHOICE' | 'TRUE_FALSE' | 'SHORT_ANSWER' | 'ESSAY' | 'FILL_IN_BLANK';
  question: string;
  options?: string[];
  correctAnswer: string;
  points: number;
  explanation?: string;
  order: number;
}

interface Quiz {
  title: string;
  description?: string;
  courseId?: number;
  timeLimit?: number;
  maxAttempts: number;
  isPublished: boolean;
  dueDate?: Date;
  questions: Question[];
}

interface QuizBuilderProps {
  quiz?: Quiz;
  courses: Array<{ id: number; title: string; code: string }>;
  onSave: (quiz: Quiz) => void;
  onCancel: () => void;
}

export default function QuizBuilder({ quiz, courses, onSave, onCancel }: QuizBuilderProps) {
  const [quizData, setQuizData] = useState<Quiz>(quiz || {
    title: '',
    description: '',
    courseId: undefined,
    timeLimit: undefined,
    maxAttempts: 1,
    isPublished: false,
    dueDate: undefined,
    questions: []
  });

  const [activeQuestion, setActiveQuestion] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);

  const addQuestion = (type: Question['type']) => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      question: '',
      options: type === 'MULTIPLE_CHOICE' ? ['', '', '', ''] : type === 'TRUE_FALSE' ? ['True', 'False'] : undefined,
      correctAnswer: '',
      points: 1,
      explanation: '',
      order: quizData.questions.length + 1
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
    setActiveQuestion(newQuestion.id);
  };

  const updateQuestion = (questionId: string, updates: Partial<Question>) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, ...updates } : q
      )
    }));
  };

  const deleteQuestion = (questionId: string) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
    setActiveQuestion(null);
  };

  const moveQuestion = (questionId: string, direction: 'up' | 'down') => {
    const currentIndex = quizData.questions.findIndex(q => q.id === questionId);
    if ((direction === 'up' && currentIndex === 0) || 
        (direction === 'down' && currentIndex === quizData.questions.length - 1)) {
      return;
    }

    const newQuestions = [...quizData.questions];
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    
    [newQuestions[currentIndex], newQuestions[targetIndex]] = 
    [newQuestions[targetIndex], newQuestions[currentIndex]];

    // Update order numbers
    newQuestions.forEach((q, index) => {
      q.order = index + 1;
    });

    setQuizData(prev => ({ ...prev, questions: newQuestions }));
  };

  const duplicateQuestion = (questionId: string) => {
    const question = quizData.questions.find(q => q.id === questionId);
    if (!question) return;

    const duplicatedQuestion: Question = {
      ...question,
      id: Math.random().toString(36).substr(2, 9),
      order: quizData.questions.length + 1
    };

    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, duplicatedQuestion]
    }));
  };

  const updateQuestionOption = (questionId: string, optionIndex: number, value: string) => {
    const question = quizData.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    const newOptions = [...question.options];
    newOptions[optionIndex] = value;

    updateQuestion(questionId, { options: newOptions });
  };

  const addOption = (questionId: string) => {
    const question = quizData.questions.find(q => q.id === questionId);
    if (!question || !question.options) return;

    updateQuestion(questionId, { options: [...question.options, ''] });
  };

  const removeOption = (questionId: string, optionIndex: number) => {
    const question = quizData.questions.find(q => q.id === questionId);
    if (!question || !question.options || question.options.length <= 2) return;

    const newOptions = question.options.filter((_, index) => index !== optionIndex);
    updateQuestion(questionId, { options: newOptions });
  };

  const QuestionEditor = ({ question }: { question: Question }) => (
    <Card className="border-2 border-blue-200 dark:border-blue-800">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline">Question {question.order}</Badge>
            <Badge variant="secondary">
              {question.type.replace('_', ' ')}
            </Badge>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveQuestion(question.id, 'up')}
              disabled={question.order === 1}
            >
              <ArrowUp className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => moveQuestion(question.id, 'down')}
              disabled={question.order === quizData.questions.length}
            >
              <ArrowDown className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => duplicateQuestion(question.id)}
            >
              <Copy className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteQuestion(question.id)}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor={`question-${question.id}`}>Question</Label>
          <Textarea
            id={`question-${question.id}`}
            value={question.question}
            onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
            placeholder="Enter your question here..."
            rows={3}
          />
        </div>

        {question.type === 'MULTIPLE_CHOICE' && question.options && (
          <div>
            <div className="flex items-center justify-between mb-2">
              <Label>Answer Options</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={() => addOption(question.id)}
              >
                <PlusCircle className="h-3 w-3 mr-1" />
                Add Option
              </Button>
            </div>
            <div className="space-y-2">
              {question.options.map((option, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      name={`correct-${question.id}`}
                      checked={question.correctAnswer === option}
                      onChange={() => updateQuestion(question.id, { correctAnswer: option })}
                      className="mr-2"
                    />
                  </div>
                  <Input
                    value={option}
                    onChange={(e) => updateQuestionOption(question.id, index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    className="flex-1"
                  />
                  {question.options && question.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeOption(question.id, index)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {question.type === 'TRUE_FALSE' && (
          <div>
            <Label>Correct Answer</Label>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`true-${question.id}`}
                  name={`answer-${question.id}`}
                  checked={question.correctAnswer === 'True'}
                  onChange={() => updateQuestion(question.id, { correctAnswer: 'True' })}
                  className="mr-2"
                />
                <Label htmlFor={`true-${question.id}`}>True</Label>
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id={`false-${question.id}`}
                  name={`answer-${question.id}`}
                  checked={question.correctAnswer === 'False'}
                  onChange={() => updateQuestion(question.id, { correctAnswer: 'False' })}
                  className="mr-2"
                />
                <Label htmlFor={`false-${question.id}`}>False</Label>
              </div>
            </div>
          </div>
        )}

        {(question.type === 'SHORT_ANSWER' || question.type === 'FILL_IN_BLANK') && (
          <div>
            <Label htmlFor={`answer-${question.id}`}>Correct Answer</Label>
            <Input
              id={`answer-${question.id}`}
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Enter the correct answer"
            />
          </div>
        )}

        {question.type === 'ESSAY' && (
          <div>
            <Label htmlFor={`rubric-${question.id}`}>Grading Rubric/Sample Answer</Label>
            <Textarea
              id={`rubric-${question.id}`}
              value={question.correctAnswer}
              onChange={(e) => updateQuestion(question.id, { correctAnswer: e.target.value })}
              placeholder="Enter grading guidelines or sample answer"
              rows={3}
            />
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor={`points-${question.id}`}>Points</Label>
            <Input
              id={`points-${question.id}`}
              type="number"
              min="1"
              value={question.points}
              onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor={`explanation-${question.id}`}>Explanation (Optional)</Label>
          <Textarea
            id={`explanation-${question.id}`}
            value={question.explanation}
            onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
            placeholder="Provide an explanation for the correct answer"
            rows={2}
          />
        </div>
      </CardContent>
    </Card>
  );

  const QuestionPreview = ({ question }: { question: Question }) => (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Question {question.order}</CardTitle>
          <Badge>{question.points} {question.points === 1 ? 'point' : 'points'}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="mb-4 font-medium">{question.question}</p>
        
        {question.type === 'MULTIPLE_CHOICE' && question.options && (
          <div className="space-y-2">
            {question.options.map((option, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  option === question.correctAnswer
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                )}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {option === question.correctAnswer && (
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    )}
                  </div>
                  {option}
                </div>
              </div>
            ))}
          </div>
        )}

        {question.type === 'TRUE_FALSE' && (
          <div className="space-y-2">
            {['True', 'False'].map((option) => (
              <div
                key={option}
                className={cn(
                  "p-3 rounded-lg border",
                  option === question.correctAnswer
                    ? "bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800"
                    : "bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700"
                )}
              >
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {option === question.correctAnswer && (
                      <div className="w-2 h-2 bg-green-600 rounded-full" />
                    )}
                  </div>
                  {option}
                </div>
              </div>
            ))}
          </div>
        )}

        {(question.type === 'SHORT_ANSWER' || question.type === 'FILL_IN_BLANK') && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg dark:bg-blue-900/20 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">Expected Answer:</p>
            <p className="font-medium text-blue-900 dark:text-blue-100">{question.correctAnswer}</p>
          </div>
        )}

        {question.type === 'ESSAY' && (
          <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg dark:bg-purple-900/20 dark:border-purple-800">
            <p className="text-sm text-purple-700 dark:text-purple-300">Grading Guidelines:</p>
            <p className="text-purple-900 dark:text-purple-100 whitespace-pre-wrap">{question.correctAnswer}</p>
          </div>
        )}

        {question.explanation && (
          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg dark:bg-yellow-900/20 dark:border-yellow-800">
            <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-1">Explanation:</p>
            <p className="text-yellow-900 dark:text-yellow-100">{question.explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Quiz Builder</h1>
            <p className="text-gray-600 dark:text-gray-400">Create interactive quizzes for your students</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowPreview(!showPreview)}>
              <Eye className="h-4 w-4 mr-2" />
              {showPreview ? 'Edit' : 'Preview'}
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(quizData)}>
              <Save className="h-4 w-4 mr-2" />
              Save Quiz
            </Button>
          </div>
        </div>

        {showPreview ? (
          /* Preview Mode */
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">{quizData.title || 'Untitled Quiz'}</CardTitle>
                {quizData.description && (
                  <CardDescription>{quizData.description}</CardDescription>
                )}
                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                  {quizData.timeLimit && <span>⏱ {quizData.timeLimit} minutes</span>}
                  <span>🔄 {quizData.maxAttempts} {quizData.maxAttempts === 1 ? 'attempt' : 'attempts'}</span>
                  <span>📝 {quizData.questions.length} {quizData.questions.length === 1 ? 'question' : 'questions'}</span>
                  <span>🏆 {quizData.questions.reduce((sum, q) => sum + q.points, 0)} total points</span>
                </div>
              </CardHeader>
            </Card>

            <div className="space-y-6">
              {quizData.questions.map((question) => (
                <QuestionPreview key={question.id} question={question} />
              ))}
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Quiz Settings */}
            <div className="lg:col-span-1">
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Quiz Settings
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Quiz Title*</Label>
                    <Input
                      id="title"
                      value={quizData.title}
                      onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Enter quiz title"
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={quizData.description}
                      onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                      placeholder="Quiz description..."
                      rows={3}
                    />
                  </div>

                  <div>
                    <Label htmlFor="course">Course</Label>
                    <Select
                      value={quizData.courseId?.toString()}
                      onValueChange={(value) => setQuizData(prev => ({ ...prev, courseId: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                      </SelectTrigger>
                      <SelectContent>
                        {courses.map((course) => (
                          <SelectItem key={course.id} value={course.id.toString()}>
                            {course.code} - {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="timeLimit">Time Limit (minutes)</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      min="1"
                      value={quizData.timeLimit || ''}
                      onChange={(e) => setQuizData(prev => ({ 
                        ...prev, 
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                      }))}
                      placeholder="No time limit"
                    />
                  </div>

                  <div>
                    <Label htmlFor="maxAttempts">Max Attempts</Label>
                    <Input
                      id="maxAttempts"
                      type="number"
                      min="1"
                      value={quizData.maxAttempts}
                      onChange={(e) => setQuizData(prev => ({ 
                        ...prev, 
                        maxAttempts: parseInt(e.target.value) || 1 
                      }))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="dueDate">Due Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {quizData.dueDate ? format(quizData.dueDate, 'PPP') : 'No due date'}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={quizData.dueDate}
                          onSelect={(date) => setQuizData(prev => ({ ...prev, dueDate: date }))}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="published"
                      checked={quizData.isPublished}
                      onCheckedChange={(checked) => setQuizData(prev => ({ ...prev, isPublished: checked }))}
                    />
                    <Label htmlFor="published">Publish immediately</Label>
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-semibold">Add Question</Label>
                    <div className="grid grid-cols-1 gap-2 mt-2">
                      <Button
                        variant="outline"
                        onClick={() => addQuestion('MULTIPLE_CHOICE')}
                        className="justify-start"
                      >
                        <List className="h-4 w-4 mr-2" />
                        Multiple Choice
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addQuestion('TRUE_FALSE')}
                        className="justify-start"
                      >
                        <ToggleLeft className="h-4 w-4 mr-2" />
                        True/False
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addQuestion('SHORT_ANSWER')}
                        className="justify-start"
                      >
                        <Type className="h-4 w-4 mr-2" />
                        Short Answer
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addQuestion('ESSAY')}
                        className="justify-start"
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Essay
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => addQuestion('FILL_IN_BLANK')}
                        className="justify-start"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Fill in Blank
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Questions List */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {quizData.questions.length === 0 ? (
                  <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                      <FileText className="h-12 w-12 text-gray-400 mb-4" />
                      <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
                        No questions yet
                      </h3>
                      <p className="text-gray-500 text-center mb-4">
                        Add questions to your quiz using the question types in the sidebar
                      </p>
                    </CardContent>
                  </Card>
                ) : (
                  quizData.questions.map((question) => (
                    <QuestionEditor key={question.id} question={question} />
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}