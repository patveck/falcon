import React, { ReactNode } from 'react';
import { Sidebar, Box, Portal, themed } from '@deity/falcon-ui';

type ThemeSidebarProps = {
  open: boolean;
  toggle: any;
  children?: ReactNode;
};

const SVGIcon = themed({
  tag: 'svg'
});

export const ThemeSidebar = (props: ThemeSidebarProps) => (
  <Sidebar
    as={Portal}
    visible={props.open}
    side="right"
    css={{ position: 'fixed', overflowX: 'inherit' }}
    boxShadow="xs"
    bg="white"
  >
    {props.children}
    <Box
      position="absolute"
      right="100%"
      top="calc(50% - 40px)"
      height={90}
      width={40}
      display="flex"
      bg={props.open ? 'primaryLight' : 'primaryDark'}
      p="sm"
      alignItems="center"
      css={{
        cursor: 'pointer',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '-2px 5px 5px rgba(0,0,0,.1)'
      }}
      onClick={props.toggle}
    >
      <SVGIcon
        viewBox="0 0 8 8"
        height={20}
        width={20}
        css={({ theme }) => ({
          fill: theme.colors.secondary
        })}
      >
        <path d="M6 0l-1 1 2 2 1-1-2-2zm-2 2l-4 4v2h2l4-4-2-2z" />
      </SVGIcon>
    </Box>
  </Sidebar>
);
