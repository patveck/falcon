import React, { ReactNode } from 'react';
import { Sidebar, Box, Portal, Icon } from '@deity/falcon-ui';

type ThemeSidebarProps = {
  open: boolean;
  toggle: any;
  children?: ReactNode;
};

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
      top="calc(50% - 35px)"
      height={90}
      width={35}
      display="flex"
      bg="white"
      px="xs"
      alignItems="center"
      css={{
        cursor: 'pointer',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        boxShadow: '-2px 5px 5px rgba(0,0,0,.1)'
      }}
      onClick={props.toggle}
    >
      <Icon src="editor" size={35} />
    </Box>
  </Sidebar>
);
