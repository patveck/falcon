import React, { Fragment, SFC } from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withCSSContext } from '@emotion/core';
import { Table, Tr, Th, H2, Tbody, Td, Thead } from '../src';

export interface Prop {
  name: string;
  required: boolean;
  description?: string;
  type: string;
  defaultValue?: string;
}
export interface PropsTableProps {
  props: Prop[];
}

export type TooltipComponent = React.ComponentType<{
  text: React.ReactNode;
  children: React.ReactNode;
}>;

const PropsTable: SFC<PropsTableProps> = props => {
  const info = props.props;

  return (
    <Fragment>
      <H2 pb="lg">Custom props</H2>
      <Table>
        <Thead>
          <Tr>
            <Th>Property</Th>
            <Th>Type</Th>
            <Th>Required</Th>
            <Th>Default</Th>
            <Th css={{ width: '40%' }}>Description</Th>
          </Tr>
        </Thead>
        <Tbody>
          {info.map(prop => (
            <Tr key={prop.name}>
              <Td>{prop.name}</Td>
              <Td>{prop.type}</Td>
              <Td>{prop.required ? '🗸' : '-'}</Td>
              <Td>{prop.defaultValue}</Td>
              <Td>{prop.description && prop.description}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Fragment>
  );
};

export default withMDXComponents(
  withCSSContext((props: any, context: any) => <PropsTable {...props} theme={context.theme} />)
);
