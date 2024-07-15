import dynamic from "next/dynamic";
import { useId } from "react";
import colors from "@/styles/abstracts/_variable.module.scss";

const Wrapper = dynamic(() => import("@/layout/Wrappers/Wrapper"));
const Box = dynamic(() => import("@mui/material/Box"));
const Grid = dynamic(() => import("@mui/material/Grid"));
const Stack = dynamic(() => import("@mui/material/Stack"));
const MyButton = dynamic(() => import("@/ui/Buttons/MyButton/MyButton"));
const LoginPageInput = dynamic(() =>
  import("@/ui/Inputs/LoginPageInput/LoginPageInput")
);

const Index = () => {
  const id = useId();
  return (
    <Wrapper>
      <h1>Design system</h1>

      <Grid container justifyContent="center">
        <Grid item xs={12} md={8}>
          <Box>
            <Stack>
              <h1>Color theme</h1>
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                flexWrap="wrap"
              >
                {Object.keys(colors).map((_item) => {
                  return (
                    <Stack key={`${id}_color`}>
                      <Box
                        sx={{
                          height: "100px",
                          width: "100px",
                          backgroundColor: colors[_item],
                        }}
                        p={2}
                        m={1}
                      />
                      <b>{_item}</b>
                    </Stack>
                  );
                })}
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Stack>
              <h1>Inputs</h1>
              <Stack
                direction="column"
                justifyContent="space-evenly"
                alignItems="center"
                flexWrap="wrap"
              >
                <LoginPageInput
                  error
                  id="test"
                  label="label"
                  value=""
                  placeholder="placeholder"
                  name="name"
                  required
                  helperText="Enter corrct entry"
                />

                <LoginPageInput
                  id="test"
                  label="label"
                  value=""
                  placeholder="placeholder"
                  name="name"
                  type="password"
                />
              </Stack>
            </Stack>
          </Box>
        </Grid>

        <Grid item xs={12} md={8}>
          <Box>
            <Stack>
              <h1>Buttons</h1>
              <Stack
                direction="row"
                justifyContent="space-evenly"
                alignItems="center"
                flexWrap="wrap"
              >
                <MyButton disableElevation variant="contained">
                  Log in
                </MyButton>
                <MyButton variant="outlined">Sign up</MyButton>
              </Stack>
            </Stack>
          </Box>
        </Grid>
      </Grid>
    </Wrapper>
  );
};

export default Index;
