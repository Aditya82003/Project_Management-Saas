import GoogleoauthButton from "@/components/auth/google-auth-button"
import { registerMutationFn } from "@/components/lib/api"
import Logo from "@/components/logo"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { zodResolver } from "@hookform/resolvers/zod"
import { useMutation } from "@tanstack/react-query"
import { useForm } from "react-hook-form"
import {  Link, useNavigate } from "react-router"
import { z } from "zod"

const SignUp = () => {
  const navigate=useNavigate()

  const { mutate, isPending } = useMutation({
    mutationFn: registerMutationFn
  })

  const formSchema = z.object({
    name: z.string().trim().min(1,{
      message:"Name is required"
    }),
    email: z.string().trim().email("Invalid email address").min(1, {
      message: "Email is required"
    }),
    password: z.string().trim().min(1, {
      message: "Password is required"
    })
  })

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: ""
    }
  })

  const onSubmit=(value:z.infer<typeof formSchema>)=>{
    if(isPending) return
    mutate(value,{
      onSuccess:()=>{
        navigate("/")
      },
      onError:(error)=>{
        console.log(error)
      }
    })
  }

  return (
    <div className="flex min-h-svh flex-col justify-center items-center gap-6 bg-muted p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Link
          to="/"
          className="flex items-center gap-2 font-medium">
          <Logo/>Team Sync.
        </Link>
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Create an account</CardTitle>
              <CardDescription>Signup with your Email or Google account</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                  <div className="grid gap-6">
                    <div className="flex flex-col gap-4">
                      <GoogleoauthButton label="Sign up" />
                    </div>
                    <div className="relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-border">
                      <span className="relative z-10 bg-background px-2 text-muted-foreground" >Or continue with</span>
                    </div>
                    <div className="grid gap-3">
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#1f7feb5] text-sm">Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John Doe" className="!h-[48px]" {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="dark:text-[#1f7feb5] text-sm">Email</FormLabel>
                              <FormControl>
                                <Input placeholder="m@example.com" className="!h-[48px]" {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="grid gap-2">
                        <FormField
                          control={form.control}
                          name="password"
                          render={({ field }) => (
                            <FormItem>
                                <FormLabel className="dark:text-[#1f7feb5] text-sm">Password</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter password" className="!h-[48px]" {...field} />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <Button
                        type="submit"
                        disabled={isPending}
                        className="w-full">
                        Sign up
                      </Button>
                    </div>
                    <div className="flex items-center justify-center text-sm">
                      <p>Already have an account?{" "}</p>
                      <Link to="/" className="underline-offset-4">
                        Sign in
                      </Link>
                    </div>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
          <div className="text-balance text-center text-sm text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 [&_a]:hover:text-primary">
            By Clicking continue,you agree to our{" "}
            <a href="#">Terms of Service</a> and <a href="#">Privarcy Policy</a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignUp