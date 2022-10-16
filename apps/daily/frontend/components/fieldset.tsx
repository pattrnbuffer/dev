import { Input, InputProps } from '@chakra-ui/react';
import { atom, useAtom, Provider } from 'jotai';
import { useMemo } from 'react';
import { FC } from 'react';

const fieldSetAtom = atom<
  { name: string; label?: string; input?: InputProps }[]
>([
  {
    name: 'name',
    // custom validator? what if it validates against context?
    // custom component
  },
]);

const fieldValues = {
  scope: Symbol();
  atom: atom<[name: string, value: string][]>([]),
}

export const FieldSet: FC = ({ children }) => {
  return (
    <Provider scope={fieldValues.scope}>
      <FieldSetRender>{children}</FieldSetRender>
    </Provider>
  );
};

export const FieldSetRender: FC<{}> = ({ children }) => {
  const [fieldSet] = useAtom(fieldSetAtom);

  return (
    <>
      {fieldSet.map(({ input }) => (
        <Input {...input} />
      ))}
      {children}
    </>
  );
};

export const FieldInput: FC<InputProps> = (props) => {
  return (
    <Input {...props} />
  )
}
