import GenericLayout from '@/components/Layouts';
import Header from '@/components/Header';
import { Button, Card, Center, Container, Grid, Image, rem, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import Link from 'next/link';

import type { GetServerSidePropsContext } from 'next';

interface Props {
    genre: Array<string>;
    actors_list: Array<string>;
    media_title: string;
    media_length: number;
    media_description: string;
    image_url: string;
}


export default function MoviesPage({ genre, actors_list, media_title, media_length, media_description, image_url }: Props) {
  return (
    <GenericLayout size="lg" bg="#dce4f5">
      <Header />
      <Container component="main" p={0} m={0} maw="100%" mih="100%">
      <SimpleGrid cols={2}>
                <Stack>
                  <Card p={rem(16)} radius='md' w="100%">
                    <Image src={image_url || 'https://placehold.co/800?text=No+Image&font=source%20sans%20pro'} maw={rem(800)} radius='md' />
                    <Title pt={rem(16)}>{media_title}</Title>
                    <Text>{media_length} hours</Text>
                    <Text>{media_description}</Text>
                  </Card>
                </Stack>
      </SimpleGrid>
    </Container>
    </GenericLayout>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
    const { id } = context.query;
    const result: Array<Props> = await fetch(`http://localhost:8000/api/v1/movie/${id}`)
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

    const { genre, actors_list, media_title, media_length, media_description, image_url } = result[0];

    return {
        props: {
            genre,
            actors_list,
            media_title,
            media_length,
            media_description,
            image_url
        }
    }
}