'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Stepper } from '@/components/ui/stepper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Form schema
const projectSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters'),
  description: z.string().optional(),
  url: z.string().url('Must be a valid URL'),

  requiresAuth: z.boolean().default(false),
  authUsername: z.string().optional(),
  authPassword: z.string().optional(),

  maxPages: z.number().min(1).max(1000),
  maxDepth: z.number().min(1).max(5),

  scanAccessibility: z.boolean().default(true),
  scanPerformance: z.boolean().default(true),
  scanSeo: z.boolean().default(true),
  scanAiCritique: z.boolean().default(true),
  scanVisualRegression: z.boolean().default(true),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const steps = [
  { id: '1', name: 'Details', description: 'Basic project information' },
  { id: '2', name: 'URL & Auth', description: 'Website URL and credentials' },
  { id: '3', name: 'Configuration', description: 'Scan settings' },
  { id: '4', name: 'Features', description: 'Choose what to monitor' },
  { id: '5', name: 'Review', description: 'Review and launch' },
];

export default function NewProject() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      maxPages: 50,
      maxDepth: 2,
      requiresAuth: false,
      scanAccessibility: true,
      scanPerformance: true,
      scanSeo: true,
      scanAiCritique: true,
      scanVisualRegression: true,
    },
  });

  const formData = watch();

  const onSubmit = async (data: ProjectFormData) => {
    setIsSubmitting(true);

    try {
      // Create project
      const response = await fetch('/api/projects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create project');

      const project = await response.json();

      // Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      // Redirect to project page
      setTimeout(() => {
        router.push(`/projects/${project.id}`);
      }, 1500);
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project. Please try again.');
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Create New Project</h1>
        <p className="text-muted-foreground">
          Set up monitoring for your web application in 5 easy steps
        </p>
      </div>

      {/* Stepper */}
      <div className="mb-12">
        <Stepper steps={steps} currentStep={currentStep} />
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)}>
        <AnimatePresence mode="wait">
          {/* Step 1: Project Details */}
          {currentStep === 0 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Give your project a name and description
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Project Name <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="name"
                      placeholder="My E-commerce Site"
                      {...register('name')}
                    />
                    {errors.name && (
                      <p className="text-sm text-destructive">
                        {errors.name.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">
                      Description{' '}
                      <span className="text-muted-foreground text-sm">
                        (Optional)
                      </span>
                    </Label>
                    <Textarea
                      id="description"
                      placeholder="Production e-commerce website for monitoring quality..."
                      rows={4}
                      {...register('description')}
                    />
                    <p className="text-xs text-muted-foreground">
                      Help your team understand what this project monitors
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 2: URL & Authentication */}
          {currentStep === 1 && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Website URL & Authentication</CardTitle>
                  <CardDescription>
                    Enter your website URL and optional login credentials
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="url">
                      Website URL <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="url"
                      type="url"
                      placeholder="https://example.com"
                      {...register('url')}
                    />
                    {errors.url && (
                      <p className="text-sm text-destructive">
                        {errors.url.message}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      We'll start scanning from this URL
                    </p>
                  </div>

                  <div className="space-y-4 rounded-lg border border-border p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="requires-auth">
                          This site requires login
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          Enable if your site needs authentication
                        </p>
                      </div>
                      <Switch
                        id="requires-auth"
                        checked={formData.requiresAuth}
                        onCheckedChange={(checked) =>
                          setValue('requiresAuth', checked)
                        }
                      />
                    </div>

                    {formData.requiresAuth && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="space-y-4 pt-4 border-t border-border"
                      >
                        <div className="space-y-2">
                          <Label htmlFor="authUsername">Username / Email</Label>
                          <Input
                            id="authUsername"
                            placeholder="admin@example.com"
                            {...register('authUsername')}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="authPassword">Password</Label>
                          <Input
                            id="authPassword"
                            type="password"
                            placeholder="••••••••"
                            {...register('authPassword')}
                          />
                        </div>

                        <div className="flex items-start gap-2 text-xs text-muted-foreground">
                          <Check className="h-4 w-4 mt-0.5 flex-shrink-0" />
                          <p>
                            Credentials are encrypted with AES-256 and stored
                            securely
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 3: Scan Configuration */}
          {currentStep === 2 && (
            <motion.div
              key="step-3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Scan Configuration</CardTitle>
                  <CardDescription>
                    Configure how deep and wide we should scan
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <Label>Maximum Pages to Scan</Label>
                    <RadioGroup
                      value={formData.maxPages.toString()}
                      onValueChange={(value) =>
                        setValue('maxPages', parseInt(value))
                      }
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {[10, 50, 100].map((value) => (
                          <div key={value}>
                            <RadioGroupItem
                              value={value.toString()}
                              id={`pages-${value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`pages-${value}`}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <span className="text-2xl font-bold">{value}</span>
                              <span className="text-xs text-muted-foreground">
                                pages
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Higher limits will take longer but provide more coverage
                    </p>
                  </div>

                  <div className="space-y-4">
                    <Label>Maximum Crawl Depth</Label>
                    <RadioGroup
                      value={formData.maxDepth.toString()}
                      onValueChange={(value) =>
                        setValue('maxDepth', parseInt(value))
                      }
                    >
                      <div className="grid grid-cols-3 gap-4">
                        {[1, 2, 3].map((value) => (
                          <div key={value}>
                            <RadioGroupItem
                              value={value.toString()}
                              id={`depth-${value}`}
                              className="peer sr-only"
                            />
                            <Label
                              htmlFor={`depth-${value}`}
                              className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-transparent p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <span className="text-2xl font-bold">{value}</span>
                              <span className="text-xs text-muted-foreground">
                                {value === 1 ? 'level' : 'levels'}
                              </span>
                            </Label>
                          </div>
                        ))}
                      </div>
                    </RadioGroup>
                    <p className="text-xs text-muted-foreground">
                      Depth 1: Homepage only • Depth 2: + direct links • Depth
                      3: + nested pages
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 4: Features */}
          {currentStep === 3 && (
            <motion.div
              key="step-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Features to Monitor</CardTitle>
                  <CardDescription>
                    Select which quality checks to run on your site
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      id: 'scanAccessibility',
                      name: 'Accessibility (WCAG 2.1)',
                      description:
                        'Check for accessibility violations and compliance',
                    },
                    {
                      id: 'scanPerformance',
                      name: 'Performance (Core Web Vitals)',
                      description:
                        'Measure page load speed and performance metrics',
                    },
                    {
                      id: 'scanSeo',
                      name: 'SEO Analysis',
                      description: 'Analyze SEO best practices and meta tags',
                    },
                    {
                      id: 'scanAiCritique',
                      name: 'AI Design Critique',
                      description:
                        'Get AI-powered insights on UI/UX and design quality',
                    },
                    {
                      id: 'scanVisualRegression',
                      name: 'Visual Regression',
                      description:
                        'Detect visual changes between scans (requires baseline)',
                    },
                  ].map((feature) => (
                    <div
                      key={feature.id}
                      className="flex items-start space-x-3 rounded-lg border border-border p-4"
                    >
                      <Checkbox
                        id={feature.id}
                        checked={
                          formData[feature.id as keyof ProjectFormData] as boolean
                        }
                        onCheckedChange={(checked) =>
                          setValue(
                            feature.id as keyof ProjectFormData,
                            checked as boolean
                          )
                        }
                      />
                      <div className="flex-1 space-y-1">
                        <Label
                          htmlFor={feature.id}
                          className="cursor-pointer font-medium"
                        >
                          {feature.name}
                        </Label>
                        <p className="text-sm text-muted-foreground">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Step 5: Review */}
          {currentStep === 4 && (
            <motion.div
              key="step-5"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Review & Launch</CardTitle>
                  <CardDescription>
                    Review your project settings before creating
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">
                        Project Details
                      </h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">Name:</dt>
                        <dd className="font-medium">{formData.name}</dd>

                        {formData.description && (
                          <>
                            <dt className="text-muted-foreground">
                              Description:
                            </dt>
                            <dd className="font-medium col-span-2 text-xs">
                              {formData.description}
                            </dd>
                          </>
                        )}

                        <dt className="text-muted-foreground">URL:</dt>
                        <dd className="font-medium">{formData.url}</dd>

                        <dt className="text-muted-foreground">
                          Requires Auth:
                        </dt>
                        <dd className="font-medium">
                          {formData.requiresAuth ? 'Yes' : 'No'}
                        </dd>
                      </dl>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Scan Configuration
                      </h4>
                      <dl className="grid grid-cols-2 gap-2 text-sm">
                        <dt className="text-muted-foreground">Max Pages:</dt>
                        <dd className="font-medium">{formData.maxPages}</dd>

                        <dt className="text-muted-foreground">Max Depth:</dt>
                        <dd className="font-medium">{formData.maxDepth}</dd>
                      </dl>
                    </div>

                    <div className="border-t pt-4">
                      <h4 className="text-sm font-medium mb-2">
                        Enabled Features
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {formData.scanAccessibility && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            Accessibility
                          </span>
                        )}
                        {formData.scanPerformance && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            Performance
                          </span>
                        )}
                        {formData.scanSeo && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            SEO
                          </span>
                        )}
                        {formData.scanAiCritique && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            AI Critique
                          </span>
                        )}
                        {formData.scanVisualRegression && (
                          <span className="px-2 py-1 bg-primary/10 text-primary text-xs rounded">
                            Visual Regression
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 0 || isSubmitting}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={nextStep} className="gap-2">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Create Project
                </>
              )}
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
