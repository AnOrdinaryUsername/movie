import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import { Button, Card, Center, Container, Grid, Image, rem, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

import type { GetServerSidePropsContext } from 'next';

interface Movie {
    id: string;
    genre: Array<string>;
    actors_list: Array<string>;
    media_title: string;
    media_length: number;
    media_description: string;
    image_url: string;
}

interface Props {
    movies: Array<Movie>;
}

export default function MoviesPage({ movies }: Props) {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
      <SimpleGrid cols={3}>
          {movies.map(({ id, media_title, media_length, media_description, image_url}: Partial<Movie>) => (
                <Stack id={id} key={id}>
                  <Card component={Link} href={`/movie/${id}`} p={rem(16)} radius='md'>
                    <Image src={image_url || 'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'} mah={rem(300)} radius='md' />
                    <Title pt={rem(16)}>{media_title}</Title>
                    <Text>{media_length} hours</Text>
                    <Text>{media_description}</Text>
                  </Card>
                </Stack>
            )
          )}
      </SimpleGrid>
    </Container>
    </GenericLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const result: Array<Movie> = await fetch("http://localhost:8000/api/v1/movie")
    .then((res) => {
        if (!res.ok) {
          throw new Error(
            'There seems to be a problem with the server at the moment. Please try again later.',
          );
        }
        return res.json();
      })
    .catch((error) => {
        console.error(error);
    });

    return {
        props: {
            movies: result
        }
    }
}