import { Container, ContainerProps, rem } from '@mantine/core';
import { ReactNode } from 'react';

interface Props extends ContainerProps {
  pageTitle?: string;
  pageDescription?: string;
  children: ReactNode;
}

export default function GenericLayout({ pageTitle, pageDescription, children, ...props }: Props) {
  return (
    <>
      <Container component="main" p={0} m={0} maw="100%" mih="100%" {...props}>
        <Container size="lg" pt={rem(24)} pb={rem(24)}>
          {children}
        </Container>
      </Container>
    </>
  );
}
