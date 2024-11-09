import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import { Button, Center, Container, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

export default function HomePage() {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
      <Center>
        <Stack>
          <Title>Reel Reviews</Title>
          <Text>Made by Real People</Text>
          <Button component={Link} href="/sign-up">Sign Up</Button>
        </Stack>
      </Center>
    </Container>
    </GenericLayout>
  );
}