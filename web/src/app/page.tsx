import { Button, Center, Container, Stack, Text, Title } from '@mantine/core';

export default function Home() {
  return (
    <Container component="main" p={0} m={0} maw="100%" mih="100%">
      <Center>
        <Stack>
          <Title>Reel Reviews</Title>
          <Text>Made by Real People</Text>
          <Button>Sign Up</Button>
        </Stack>
      </Center>
    </Container>
  );
}
