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
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar as CalendarIcon,
  Clock,
  Settings,
  Save,
  Eye,
  PlusCircle,
  Trash2,
  GraduationCap,
  FileText,
  Users,
  BarChart3,
  AlertCircle,
  CheckCircle,
  Timer,
  Award
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface TestSection {
  id: string;
  title: string;
  description?: string;
  timeLimit?: number;
  order: number;
  questionCount: number;
}

interface Test {
  title: string;
  description?: string;
  courseId?: number;
  testType: 'EXAM' | 'QUIZ' | 'ASSESSMENT' | 'PRACTICE';
  duration: number;
  maxMarks: number;
  passingMarks: number;
  startDate?: Date;
  endDate?: Date;
  isPublished: boolean;
  sections: TestSection[];
  instructions?: string;
  allowCalculator: boolean;
  allowBacktrack: boolean;
  randomizeQuestions: boolean;
  showResultsImmediately: boolean;
}

interface TestSchedulerProps {
  test?: Test;
  courses: Array<{ id: number; title: string; code: string }>;
  onSave: (test: Test) => void;
  onCancel: () => void;
}

export default function TestScheduler({ test, courses, onSave, onCancel }: TestSchedulerProps) {
  const [testData, setTestData] = useState<Test>(test || {
    title: '',
    description: '',
    courseId: undefined,
    testType: 'EXAM',
    duration: 60,
    maxMarks: 100,
    passingMarks: 50,
    startDate: undefined,
    endDate: undefined,
    isPublished: false,
    sections: [],
    instructions: '',
    allowCalculator: false,
    allowBacktrack: true,
    randomizeQuestions: false,
    showResultsImmediately: false
  });

  const [activeTab, setActiveTab] = useState('basic');

  const addSection = () => {
    const newSection: TestSection = {
      id: Math.random().toString(36).substr(2, 9),
      title: `Section ${testData.sections.length + 1}`,
      description: '',
      timeLimit: undefined,
      order: testData.sections.length + 1,
      questionCount: 0
    };

    setTestData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
  };

  const updateSection = (sectionId: string, updates: Partial<TestSection>) => {
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.map(s => 
        s.id === sectionId ? { ...s, ...updates } : s
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setTestData(prev => ({
      ...prev,
      sections: prev.sections.filter(s => s.id !== sectionId)
    }));
  };

  const BasicSettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Set up the fundamental test details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Test Title*</Label>
              <Input
                id="title"
                value={testData.title}
                onChange={(e) => setTestData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Enter test title"
              />
            </div>
            <div>
              <Label htmlFor="testType">Test Type</Label>
              <Select
                value={testData.testType}
                onValueChange={(value: Test['testType']) => setTestData(prev => ({ ...prev, testType: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="EXAM">Examination</SelectItem>
                  <SelectItem value="QUIZ">Quiz</SelectItem>
                  <SelectItem value="ASSESSMENT">Assessment</SelectItem>
                  <SelectItem value="PRACTICE">Practice Test</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={testData.description}
              onChange={(e) => setTestData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe the test content and objectives..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="course">Course</Label>
            <Select
              value={testData.courseId?.toString()}
              onValueChange={(value) => setTestData(prev => ({ ...prev, courseId: parseInt(value) }))}
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
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Scoring & Timing</CardTitle>
          <CardDescription>Configure test duration and marking scheme</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="duration">Duration (minutes)*</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={testData.duration}
                onChange={(e) => setTestData(prev => ({ 
                  ...prev, 
                  duration: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="maxMarks">Maximum Marks*</Label>
              <Input
                id="maxMarks"
                type="number"
                min="1"
                value={testData.maxMarks}
                onChange={(e) => setTestData(prev => ({ 
                  ...prev, 
                  maxMarks: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
            <div>
              <Label htmlFor="passingMarks">Passing Marks*</Label>
              <Input
                id="passingMarks"
                type="number"
                min="1"
                max={testData.maxMarks}
                value={testData.passingMarks}
                onChange={(e) => setTestData(prev => ({ 
                  ...prev, 
                  passingMarks: parseInt(e.target.value) || 1 
                }))}
              />
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 className="h-4 w-4 text-blue-600" />
              <span className="font-medium text-blue-900 dark:text-blue-100">Scoring Overview</span>
            </div>
            <div className="text-sm text-blue-700 dark:text-blue-300">
              <p>Passing percentage: {((testData.passingMarks / testData.maxMarks) * 100).toFixed(1)}%</p>
              <p>Duration: {testData.duration} minutes ({Math.floor(testData.duration / 60)}h {testData.duration % 60}m)</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ScheduleTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Schedule</CardTitle>
          <CardDescription>Set when the test will be available to students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Start Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {testData.startDate ? format(testData.startDate, 'PPP p') : 'Select start date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={testData.startDate}
                    onSelect={(date) => setTestData(prev => ({ ...prev, startDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <Label>End Date & Time</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {testData.endDate ? format(testData.endDate, 'PPP p') : 'Select end date'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={testData.endDate}
                    onSelect={(date) => setTestData(prev => ({ ...prev, endDate: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {testData.startDate && testData.endDate && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="font-medium text-green-900 dark:text-green-100">Schedule Summary</span>
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                <p>Test window: {Math.ceil((testData.endDate.getTime() - testData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days</p>
                <p>From: {format(testData.startDate, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}</p>
                <p>To: {format(testData.endDate, 'EEEE, MMMM d, yyyy \'at\' h:mm a')}</p>
              </div>
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Switch
              id="published"
              checked={testData.isPublished}
              onCheckedChange={(checked) => setTestData(prev => ({ ...prev, isPublished: checked }))}
            />
            <Label htmlFor="published">Publish test immediately</Label>
          </div>

          {testData.isPublished && (
            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-orange-600" />
                <span className="font-medium text-orange-900 dark:text-orange-100">
                  Test will be visible to students once published
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const SectionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Test Sections</h3>
          <p className="text-gray-600 dark:text-gray-400">Organize your test into logical sections</p>
        </div>
        <Button onClick={addSection}>
          <PlusCircle className="h-4 w-4 mr-2" />
          Add Section
        </Button>
      </div>

      {testData.sections.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-300 dark:border-gray-700">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400 mb-2">
              No sections yet
            </h3>
            <p className="text-gray-500 text-center mb-4">
              Add sections to organize your test questions into logical groups
            </p>
            <Button onClick={addSection}>
              <PlusCircle className="h-4 w-4 mr-2" />
              Add First Section
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {testData.sections.map((section) => (
            <Card key={section.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Section {section.order}</CardTitle>
                    <Badge variant="outline">{section.questionCount} questions</Badge>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteSection(section.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor={`section-title-${section.id}`}>Section Title</Label>
                  <Input
                    id={`section-title-${section.id}`}
                    value={section.title}
                    onChange={(e) => updateSection(section.id, { title: e.target.value })}
                    placeholder="Enter section title"
                  />
                </div>

                <div>
                  <Label htmlFor={`section-description-${section.id}`}>Description</Label>
                  <Textarea
                    id={`section-description-${section.id}`}
                    value={section.description}
                    onChange={(e) => updateSection(section.id, { description: e.target.value })}
                    placeholder="Describe this section..."
                    rows={2}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor={`section-time-${section.id}`}>Time Limit (minutes)</Label>
                    <Input
                      id={`section-time-${section.id}`}
                      type="number"
                      min="1"
                      value={section.timeLimit || ''}
                      onChange={(e) => updateSection(section.id, { 
                        timeLimit: e.target.value ? parseInt(e.target.value) : undefined 
                      })}
                      placeholder="No limit"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`section-questions-${section.id}`}>Question Count</Label>
                    <Input
                      id={`section-questions-${section.id}`}
                      type="number"
                      min="0"
                      value={section.questionCount}
                      onChange={(e) => updateSection(section.id, { 
                        questionCount: parseInt(e.target.value) || 0 
                      })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );

  const SettingsTab = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Test Instructions</CardTitle>
          <CardDescription>Provide instructions that students will see before starting the test</CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea
            value={testData.instructions}
            onChange={(e) => setTestData(prev => ({ ...prev, instructions: e.target.value }))}
            placeholder="Enter test instructions here..."
            rows={6}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Test Behavior</CardTitle>
          <CardDescription>Configure how the test behaves for students</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowCalculator">Allow Calculator</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students can use a built-in calculator</p>
            </div>
            <Switch
              id="allowCalculator"
              checked={testData.allowCalculator}
              onCheckedChange={(checked) => setTestData(prev => ({ ...prev, allowCalculator: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="allowBacktrack">Allow Backtracking</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Students can go back to previous questions</p>
            </div>
            <Switch
              id="allowBacktrack"
              checked={testData.allowBacktrack}
              onCheckedChange={(checked) => setTestData(prev => ({ ...prev, allowBacktrack: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="randomizeQuestions">Randomize Questions</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Show questions in random order</p>
            </div>
            <Switch
              id="randomizeQuestions"
              checked={testData.randomizeQuestions}
              onCheckedChange={(checked) => setTestData(prev => ({ ...prev, randomizeQuestions: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="showResults">Show Results Immediately</Label>
              <p className="text-sm text-gray-600 dark:text-gray-400">Display results when test is submitted</p>
            </div>
            <Switch
              id="showResults"
              checked={testData.showResultsImmediately}
              onCheckedChange={(checked) => setTestData(prev => ({ ...prev, showResultsImmediately: checked }))}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Test Scheduler</h1>
            <p className="text-gray-600 dark:text-gray-400">Create and schedule formal assessments</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
            <Button onClick={() => onSave(testData)}>
              <Save className="h-4 w-4 mr-2" />
              Save Test
            </Button>
          </div>
        </div>

        {/* Test Overview */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{testData.title || 'Untitled Test'}</h2>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <GraduationCap className="h-4 w-4" />
                    <Badge variant="outline">{testData.testType}</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="h-4 w-4" />
                    {testData.duration} minutes
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    {testData.maxMarks} marks
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {testData.sections.length} sections
                  </div>
                </div>
              </div>
              <Badge variant={testData.isPublished ? "default" : "secondary"}>
                {testData.isPublished ? "Published" : "Draft"}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Navigation Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="sections">Sections</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="mt-6">
            <BasicSettingsTab />
          </TabsContent>

          <TabsContent value="schedule" className="mt-6">
            <ScheduleTab />
          </TabsContent>

          <TabsContent value="sections" className="mt-6">
            <SectionsTab />
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <SettingsTab />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}