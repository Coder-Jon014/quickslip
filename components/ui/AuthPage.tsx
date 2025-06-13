"use client"

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { supabase } from '@/lib/supabaseClient'

interface FormData {
  email: string
  password: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  rememberMe: boolean
}

interface ValidationErrors {
  email?: string
  password?: string
  confirmPassword?: string
  firstName?: string
  lastName?: string
  general?: string
}

interface AuthState {
  isLoading: boolean
  isSuccess: boolean
  error: string | null
}

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    rememberMe: false
  })
  const [errors, setErrors] = useState<ValidationErrors>({})
  const [authState, setAuthState] = useState<AuthState>({
    isLoading: false,
    isSuccess: false,
    error: null
  })
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set())
  const [user, setUser] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password: string): boolean => {
    return password.length >= 8
  }

  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case 'email':
        if (!value) return 'Email is required'
        if (!validateEmail(value)) return 'Please enter a valid email address'
        break
      case 'password':
        if (!value) return 'Password is required'
        if (!validatePassword(value)) return 'Password must be at least 8 characters'
        break
      case 'confirmPassword':
        if (!isLogin && !value) return 'Please confirm your password'
        if (!isLogin && value !== formData.password) return 'Passwords do not match'
        break
      case 'firstName':
        if (!isLogin && !value) return 'First name is required'
        break
      case 'lastName':
        if (!isLogin && !value) return 'Last name is required'
        break
    }
    return undefined
  }

  const handleInputChange = (name: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    
    if (typeof value === 'string' && touchedFields.has(name)) {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const handleBlur = (name: string) => {
    setTouchedFields(prev => new Set(prev).add(name))
    const value = formData[name as keyof FormData]
    if (typeof value === 'string') {
      const error = validateField(name, value)
      setErrors(prev => ({ ...prev, [name]: error }))
    }
  }

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {}
    
    newErrors.email = validateField('email', formData.email)
    newErrors.password = validateField('password', formData.password)
    
    if (!isLogin) {
      newErrors.firstName = validateField('firstName', formData.firstName || '')
      newErrors.lastName = validateField('lastName', formData.lastName || '')
      newErrors.confirmPassword = validateField('confirmPassword', formData.confirmPassword || '')
    }

    setErrors(newErrors)
    return !Object.values(newErrors).some(error => error)
  }

  const simulateAuth = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (formData.email === 'error@test.com') {
          reject(new Error('Invalid credentials'))
        } else {
          resolve()
        }
      }, 2000)
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) return

    setAuthState({ isLoading: true, isSuccess: false, error: null })

    try {
      await simulateAuth()
      setAuthState({ isLoading: false, isSuccess: true, error: null })
      
      setTimeout(() => {
        console.log('Redirecting to dashboard...')
      }, 1500)
    } catch (error) {
      setAuthState({
        isLoading: false,
        isSuccess: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      })
    }
  }

  const handleSocialLogin = async (provider: string) => {
    if (provider === 'Google') {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined }
      })
      return
    }
    setAuthState({ isLoading: true, isSuccess: false, error: null })
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      setAuthState({ isLoading: false, isSuccess: true, error: null })
    } catch {
      setAuthState({
        isLoading: false,
        isSuccess: false,
        error: `Failed to sign in with ${provider}`
      })
    }
  }

  const toggleMode = () => {
    setIsLogin(!isLogin)
    setErrors({})
    setAuthState({ isLoading: false, isSuccess: false, error: null })
    setTouchedFields(new Set())
    setFormData(prev => ({
      ...prev,
      confirmPassword: '',
      firstName: '',
      lastName: ''
    }))
  }

  useEffect(() => {
    setErrors({})
  }, [isLogin])

  const getUserAndEnsureProfile = async () => {
    const { data } = await supabase.auth.getUser();
    setUser(data?.user || null);
    setLoading(false);
    const user = data?.user;
    if (user) {
      // Check if profile exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      if (!profile) {
        await supabase.from('profiles').insert([
          {
            id: user.id,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
            avatar_url: user.user_metadata?.avatar_url || null,
            // Add other fields as needed
          },
        ]);
      }
    }
  };

  useEffect(() => {
    getUserAndEnsureProfile();
    const { data: listener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        getUserAndEnsureProfile();
      }
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const formVariants = {
    hidden: { opacity: 0, x: isLogin ? -20 : 20 },
    visible: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isLogin ? 20 : -20 }
  }

  if (authState.isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8 text-green-600 dark:text-green-400" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome!</h2>
          <p className="text-muted-foreground">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-2"
        >
          <h1 className="text-3xl font-bold text-foreground">
            {isLogin ? 'Welcome back' : 'Create account'}
          </h1>
          <p className="text-muted-foreground">
            {isLogin 
              ? 'Sign in to your account to continue' 
              : 'Sign up to get started with your account'
            }
          </p>
        </motion.div>

        <Card className="p-6 border-border bg-card">
          <AnimatePresence mode="wait">
            {authState.error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-4"
              >
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authState.error}</AlertDescription>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-4 mb-6">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('Google')}
              disabled={authState.isLoading}
            >
              <Chrome className="w-4 h-4 mr-2" />
              Continue with Google
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => handleSocialLogin('GitHub')}
              disabled={authState.isLoading}
            >
              <Github className="w-4 h-4 mr-2" />
              Continue with GitHub
            </Button>
          </div>

          <div className="relative mb-6">
            <Separator />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="bg-card px-2 text-sm text-muted-foreground">
                or continue with email
              </span>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              variants={formVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-4"
            >
              {!isLogin && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className={`pl-10 ${errors.firstName ? 'border-destructive' : ''}`}
                        value={formData.firstName || ''}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        onBlur={() => handleBlur('firstName')}
                        disabled={authState.isLoading}
                        aria-describedby={errors.firstName ? 'firstName-error' : undefined}
                      />
                    </div>
                    {errors.firstName && (
                      <p id="firstName-error" className="text-sm text-destructive">
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="lastName"
                        type="text"
                        placeholder="Doe"
                        className={`pl-10 ${errors.lastName ? 'border-destructive' : ''}`}
                        value={formData.lastName || ''}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        onBlur={() => handleBlur('lastName')}
                        disabled={authState.isLoading}
                        aria-describedby={errors.lastName ? 'lastName-error' : undefined}
                      />
                    </div>
                    {errors.lastName && (
                      <p id="lastName-error" className="text-sm text-destructive">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="john@example.com"
                    className={`pl-10 ${errors.email ? 'border-destructive' : ''}`}
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    disabled={authState.isLoading}
                    aria-describedby={errors.email ? 'email-error' : undefined}
                  />
                </div>
                {errors.email && (
                  <p id="email-error" className="text-sm text-destructive">
                    {errors.email}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    className={`pl-10 pr-10 ${errors.password ? 'border-destructive' : ''}`}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    onBlur={() => handleBlur('password')}
                    disabled={authState.isLoading}
                    aria-describedby={errors.password ? 'password-error' : undefined}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={authState.isLoading}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p id="password-error" className="text-sm text-destructive">
                    {errors.password}
                  </p>
                )}
              </div>

              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      value={formData.confirmPassword || ''}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      onBlur={() => handleBlur('confirmPassword')}
                      disabled={authState.isLoading}
                      aria-describedby={errors.confirmPassword ? 'confirmPassword-error' : undefined}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      disabled={authState.isLoading}
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && (
                    <p id="confirmPassword-error" className="text-sm text-destructive">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              )}

              {isLogin && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="rememberMe"
                      checked={formData.rememberMe}
                      onCheckedChange={(checked) => 
                        handleInputChange('rememberMe', checked as boolean)
                      }
                      disabled={authState.isLoading}
                    />
                    <Label htmlFor="rememberMe" className="text-sm">
                      Remember me
                    </Label>
                  </div>
                  <Button
                    variant="link"
                    className="px-0 text-sm"
                    disabled={authState.isLoading}
                  >
                    Forgot password?
                  </Button>
                </div>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={authState.isLoading}
              >
                {authState.isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    {isLogin ? 'Signing in...' : 'Creating account...'}
                  </>
                ) : (
                  isLogin ? 'Sign in' : 'Create account'
                )}
              </Button>
            </motion.form>
          </AnimatePresence>
        </Card>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            {isLogin ? "Don't have an account?" : 'Already have an account?'}
            <Button
              variant="link"
              className="px-1 text-sm"
              onClick={toggleMode}
              disabled={authState.isLoading}
            >
              {isLogin ? 'Sign up' : 'Sign in'}
            </Button>
          </p>
        </div>

        <div className="text-center text-xs text-muted-foreground">
          <p>
            By continuing, you agree to our{' '}
            <Button variant="link" className="px-0 text-xs h-auto">
              Terms of Service
            </Button>{' '}
            and{' '}
            <Button variant="link" className="px-0 text-xs h-auto">
              Privacy Policy
            </Button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default AuthPage 