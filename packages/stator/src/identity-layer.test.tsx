import React, { FC } from 'react';
import { render, renderHook } from '@testing-library/react';
import { createIdentityLayer } from './identity-layer';
import { expect, test } from '@jest/globals';

test('createIdentityLayer', () => {
  const [IdLayer, useIdLayer] = createIdentityLayer(value =>
    value == null ? 0 : 1,
  );

  const ShowLayerId: FC = () => <>{useIdLayer()}</>;

  const { findByText } = render(
    <IdLayer>
      <IdLayer>
        <IdLayer>
          <ShowLayerId />
        </IdLayer>
      </IdLayer>
    </IdLayer>,
  );

  expect(findByText(2));
});
