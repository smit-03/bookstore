import { Typography, styled } from "@mui/material";
import { Button, Breadcrumbs, Paper, Grid } from "@mui/material";

//makeStyles is not compatible with 'react-18'. Can use styled compo. instead
/* const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: theme.spacing(4),
    },
    form: {
        width: '100%',
        : theme.spacing(2),
    },
    submitButton: {
        margin: theme.spacing(3, 0, 2),
    },
})); */

export const PageContainer = styled("div")`
  min-height: 77vh;
  position: relative;
  margin-top: 10vh;
`;

export const ErrorContainer = styled("div")`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 75vh;
  font-family: Arial, sans-serif;
`;

export const ErrorTitle = styled("h1")`
  font-size: 3rem;
  margin-bottom: 2rem;
`;

export const ErrorSubtitle = styled("h2")`
  font-size: 1.5rem;
  margin-bottom: 2rem;
`;

export const GridContainer = styled(Grid)`
  position: relative;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
  padding: 2rem;
  margin-top: 10vh;
`;

export const BookCard = styled(Paper)`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 94%;
  padding: 0.8rem;
  background-color: #f5f5f5;
  border-radius: 8px;
  align-items: center;
  text-align: center;
  box-shadow: 0px 3px 3px -2px rgba(96, 70, 70, 0.455),
    0px 3px 4px 0px rgba(179, 82, 82, 0.688),
    0px 1px 8px 0px rgba(239, 80, 80, 0.612);
  transition: transform 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
  }
`;

export const BookImage = styled("img")`
  width: 100%;
  height: 15vh;
  border-radius: 8px;
  object-fit: cover;
  margin-bottom: 0.6rem;
`;

export const BookName = styled("span")`
  font-size: 1rem;
`;

export const BookSub = styled("span")`
  font-size: 0.9rem;
`;

export const MainContainer = styled("div")`
  display: flex;
  flex-direction: row;
  margin: 2rem;
  justify-content: space-between;
`;

export const LogFormContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
  flex: 1;
  width: 100%;
`;

export const InfoContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
  font-size: 18px;
  flex: 1;
  width: 100%;
`;

export const SectionTitle = styled("h2")`
  margin-bottom: 2.5rem;
  font-weight: 400;
  position: relative;
  font-size: 2vw;
  &::after {
    content: "";
    position: absolute;
    bottom: -13px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: rgba(0, 0, 0, 0.1);
  }
`;
export const StyledButton = styled(Button)`
  align-self: flex-start;
  background-color: #f82626;
`;

export const BreadcrumbsContainer = styled(Breadcrumbs)`
  margin: auto;
  display: flex;
  align-items: center;
  margin-top: 3vh;
`;

export const RegFormContainer = styled("div")`
  display: flex;
  flex-direction: column;
  margin: 2rem;
`;

export const FieldWrapper = styled("div")`
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
`;

export const PageTitle = styled(Typography)`
  color: #414141;
  position: relative;
  font-size: 5vh;
  text-align: center;
  font-family: "Roboto", "Helvetica", "Arial", sans-serif;
  font-weight: 700;
  line-height: 1.2;
  margin-bottom: 3vh;
  letter-spacing: 0px;
  padding-bottom: 18px;
  &::after {
    left: 50%;
    width: 165px;
    bottom: 0;
    height: 2px;
    content: "";
    position: absolute;
    transform: translateX(-50%);
    background-color: #fb3c3c;
  }
`;

export const SearchField = styled("div")`
  display: flex;
  align-items: center;
  border-radius: 4px;
  padding: 3px;
  border: 2px solid #838383;
  & input {
    flex-grow: 1;
    padding: 8px;
    font-size: 16px;
  }
`;

export const CartItem = styled("div")`
  display: flex;
  flex-direction: row;
  margin-top: 2rem;
`;
export const ItemLeft = styled("div")`
  display: flex;
  align-items: flex-start;
`;
export const ItemRight = styled("div")`
  display: flex;
  align-items: flex-end;
`;
export const ItemDetails = styled("div")`
  display: flex;
  flex-direction: column;
`;
