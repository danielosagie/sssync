import { Controller, useActionForm } from "@gadgetinc/react";
import { api } from "../api";
import { useLocation, useNavigate } from "react-router-dom";
import {
  BlockStack,
  Button,
  Card,
  Divider,
  Form,
  FormLayout,
  Text,
  TextField,
  Banner,
} from "@shopify/polaris";
import GoogleIcon from "../icons/GoogleIcon";

export default function SignUp() {
  const navigate = useNavigate();
  const { search } = useLocation();
  
  const {
    submit,
    control,
    formState: { errors, isSubmitSuccessful, isSubmitting },
  } = useActionForm(api.user.signUp, {
    onSuccess: () => {
      // Allow the success message to display briefly before redirecting
      setTimeout(() => {
        navigate("/signed-in");
      }, 1500);
    },
  });

  return (
    <Card>
      <Form onSubmit={submit}>
        <BlockStack gap="400">
          <Text as="h1" variant="headingLg">
            Create account
          </Text>
          
          {isSubmitSuccessful && (
            <Banner title="Account created successfully" tone="success">
              <p>Please check your inbox for a verification email.</p>
            </Banner>
          )}
          
          {errors?.root?.message && (
            <Banner title="Error creating account" tone="critical">
              <p>{errors.root.message}</p>
            </Banner>
          )}
          
          <FormLayout>
            <Controller
              name="email"
              control={control}
              rules={{ 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              }}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Email"
                  placeholder="yourname@example.com"
                  type="email"
                  autoComplete="email"
                  {...fieldProps}
                  error={errors?.email?.message}
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            <Controller
              name="password"
              control={control}
              rules={{
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters"
                }
              }}
              render={({ field: { ref, ...fieldProps } }) => (
                <TextField
                  label="Password"
                  placeholder="Password"
                  type="password"
                  autoComplete="new-password"
                  {...fieldProps}
                  error={errors?.password?.message}
                  value={fieldProps.value ?? ""}
                />
              )}
            />
            
            <Button fullWidth disabled={isSubmitting} submit>
              {isSubmitting ? "Signing up..." : "Sign up"}
            </Button>
            
            <Text as="p" variant="bodySm" alignment="center">
              Already have an account? <Button variant="plain" url="/sign-in">Sign in</Button>
            </Text>
            
            <Divider />
            
            <Button fullWidth url={`/auth/google/start${search}`} icon={GoogleIcon}>
              Continue with Google
            </Button>
          </FormLayout>
        </BlockStack>
      </Form>
    </Card>
  );
}
