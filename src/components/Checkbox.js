import React from 'react';
import styled from 'styled-components';
import { colors } from '../styles/styles';

const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
  border: 0;
  clip: rect(0 0 0 0);
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`

const StyledCheckbox = styled.div`
  display: inline-block;
  width: 15px;
  height: 15px;
  background: ${props => props.checked ? colors.primary : 'none'};
  border: 3px solid ${colors.primary};
  border-radius: 25px;
  transition: all 150ms;
`

const CheckboxContainer = styled.div`
  display: inline-block;
  vertical-align: middle;
  padding-right: 10px;
`

const Checkbox = ({ className, checked, ...props }) => (
    <CheckboxContainer className={className}>
      <HiddenCheckbox checked={checked} {...props} />
      <StyledCheckbox checked={checked} />
    </CheckboxContainer>
);

export default Checkbox;