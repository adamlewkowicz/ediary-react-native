import React, { ReactNode } from 'react';
import { Modal as NativeModal } from 'react-native';
import styled from 'styled-components/native';

interface ModalProps {
  visible: boolean
  onClose: () => void
  children: ReactNode
}
export const Modal = (props: ModalProps) => {
  return (
    <NativeModal
      visible={props.visible}
      onRequestClose={props.onClose}
      transparent
    >
      <Container onPress={props.onClose}>
        <Content>
          {props.children}
        </Content>
      </Container>
    </NativeModal>
  );
}

const Container = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(255,255,255,0.85);
  align-items: center;
  justify-content: flex-end;
`

const Content = styled.View`
  border-radius: 5;
  height: 50%;
  background: #fff;
  elevation: 4;
  flex: 1;

`