import { useSignOut } from "@gadgetinc/react";
import { Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { ShopContext, AuthContext } from "../providers";
import { BlockStack, Card, Text, Box } from "@shopify/polaris";
import { SquareConnect } from "../components/SquareConnect";
import { OnboardingDialog } from "../components/OnboardingDialog";
import { Button } from "../components/ui/button";

export default function SignedIn() {
  const [isOpen, setIsOpen] = useState(false);
  const signOut = useSignOut();
  const { user } = useContext(AuthContext);
  const { shops } = useContext(ShopContext);
  
  useEffect(() => {
    console.log("isOpen state changed:", isOpen);
  }, [isOpen]);

  if (!user) {
    return <div>Loading...</div>;
  }

  return user ? (
    <>
      <BlockStack>
        <img
          src={`https://${process.env.GADGET_PUBLIC_APP_SLUG}${process.env.GADGET_PUBLIC_APP_ENV !== "production" ? `--${process.env.GADGET_PUBLIC_APP_ENV}` : ""}.gadget.app/shopify_glyph_black.svg`}
          alt="Shopify logo"
          height={70}
        />

        <Text as="span">You are now signed into {process.env.GADGET_APP}</Text>
      </BlockStack>
      <Box>
        <Text as="p">Start building your app&apos;s signed in area</Text>
        <a
          href="/edit/files/web/routes/signed-in.jsx"
          target="_blank"
          rel="noreferrer"
          style={{ fontWeight: 500 }}
        >
          web/routes/signed-in.jsx
        </a>
      </Box>
      {/* <SquareConnect shopId={shops?.[0]?.id ?? ""} /> */}
      <Button
        className="bg-black text-white p-4"
        onClick={() => {
          setIsOpen(true);
          console.log("Button clicked, isOpen:", isOpen); // Debugging
        }}
      >
        Start Onboarding!
      </Button>
      {isOpen && <OnboardingFlow isOpen={isOpen} setIsOpen={setIsOpen} onComplete={() => setIsOpen(false)} />}
      
      <BlockStack gap="300">
        <Card>
          <BlockStack inlineAlign="center" gap="200">
            <Text as="h2" variant="headingLg">
              User
            </Text>
            <img
              className="icon"
              src={
                user.googleImageUrl ??
                "https://assets.gadget.dev/assets/default-app-assets/default-user-icon.svg"
              }
            />
            <BlockStack gap="100">
              <Text as="p">id: {user?.id}</Text>
              <Text as="p">
                name: {user?.firstName} {user?.lastName}
              </Text>
              <Text as="p">
                email: <a href={`mailto:${user?.email}`}>{user?.email}</a>
              </Text>
              <Text as="p">created: {user?.createdAt?.toString()}</Text>
            </BlockStack>
          </BlockStack>
        </Card>
        {shops?.map(({ id, domain, shopOwner }) => (
          <Card key={id}>
            <Text as="h2" variant="headingLg">
              Shop information
            </Text>
            <Box>
              <BlockStack>
                <Text as="p">id: {id}</Text>
                <Text as="p">domain: {domain}</Text>
                <Text as="p">shopOwner: {shopOwner}</Text>
              </BlockStack>
            </Box>
          </Card>
        ))}
        <Box>
          <Text as="h2" variant="headingLg">
            Actions:
          </Text>
          <BlockStack>
            <Link to="/change-password">Change password</Link>
            <Button className="bg-black text-white p-4" onClick={signOut}>
              Sign Out
            </Button>
          </BlockStack>
        </Box>
      </BlockStack>
    </>
  ) : null;
}
