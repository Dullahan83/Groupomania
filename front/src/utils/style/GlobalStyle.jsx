import { createGlobalStyle } from 'styled-components'

const StyledGlobalStyle = createGlobalStyle`
    *{
        font-family: 'Merriweather', Helvetica, sans-serif;
    }
    body, h1, h2, h3, h4, p{
        margin: 0
    }
    @keyframes rotateLogo {
    0% {
        transform: rotate(0deg);
        } 
    100% {
        transform: rotate(360deg);
    }
    const primary = {color: #152847ff}
}
`
function GlobalStyle() {
  return <StyledGlobalStyle />
}

export default GlobalStyle
