import React from 'react';

import Background from '../components/Background';
import ButtonDemo from '../components/ButtonDemo';
import Container from '../components/Container';

export default function ButtonDemoPage() {
  return (
    <>
      <Background />
      <div className="relative min-h-screen">
        <Container className="py-8">
          <ButtonDemo />
        </Container>
      </div>
    </>
  );
} 