import React, { Children } from 'react';
import { withMDXComponents } from '@mdx-js/tag/dist/mdx-provider';
import { withCSSContext } from '@emotion/core';
import { mappings, ResponsivePropMapping } from '../src/theme/responsiveprops';
import { Table, Thead, Tr, Th, Tbody, Td, Theme, Box, H2, H3 } from '../src';

const mappingKeys = Object.keys(mappings);

const toKebabCase = (val: string) => val.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();

const sectionsMeta = {
  spacing: {
    unit: 'px',
    hint: value => <Box bg="primaryDark" border="light" borderColor="black" width={value} height={30} />
  },
  colors: {
    unit: '',
    hint: value => (
      <Box
        width={30}
        height={30}
        bg="primaryLight"
        border="regular"
        borderColor="primaryDark"
        css={{
          background: value
        }}
      />
    )
  },

  fontSizes: {
    unit: 'px',
    hint: value => (
      <Box
        p="xs"
        css={{
          fontSize: value
        }}
      >
        {value}
        px
      </Box>
    )
  }
};

const ResponsiveProps: React.SFC<{ theme: Theme; themeProp: string }> = ({ theme, themeProp }) => (
  <React.Fragment>
    <Table mb="xl">
      <Thead>
        <Tr>
          <Th>Property</Th>
          <Th>Meaning(CSS property)</Th>
        </Tr>
      </Thead>

      <Tbody>
        {mappingKeys.filter(name => (mappings[name] as ResponsivePropMapping).themeProp === themeProp).map(name => {
          const prop: ResponsivePropMapping = mappings[name];
          const cssProp = prop.cssProp || (!prop.transformToCss ? name : '');

          return (
            <Tr key={name}>
              <Td>{name}</Td>

              <Td>
                {cssProp && toKebabCase(cssProp)}
                {!cssProp && (
                  <Box color="secondary" title={prop.transformToCss.toString()}>
                    transform function
                  </Box>
                )}
              </Td>
            </Tr>
          );
        })}
      </Tbody>
    </Table>

    <H3 mb="md" fontWeight="regular">
      Allowed values
    </H3>

    <Table mb="xl">
      <Thead>
        <Tr>
          <Th>Property Value</Th>
          <Th>Meaning (CSS property value)</Th>
          <Th>Preview</Th>
        </Tr>
      </Thead>
      <Tbody>
        {Object.keys(theme[themeProp]).map(key => (
          <Tr key={key}>
            <Td>{key}</Td>
            <Td>
              {theme[themeProp][key]} {sectionsMeta[themeProp].unit}
            </Td>
            <Td>{sectionsMeta[themeProp].hint(theme[themeProp][key])}</Td>
          </Tr>
        ))}
      </Tbody>
    </Table>
  </React.Fragment>
);

export default withMDXComponents(
  withCSSContext((props: any, context: any) => <ResponsiveProps theme={context.theme} {...props} />)
);
