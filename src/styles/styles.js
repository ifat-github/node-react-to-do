import { createGlobalStyle } from "styled-components";

export const colors = {
    primary: "#ced680"
};

export const GlobalStyle = createGlobalStyle`
    body {
        background: #093333;
        color: #fff;
    }

    body, input {
        font-family: 'Roboto', sans-serif;
    }
`;