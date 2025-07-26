import React, { useEffect, useState } from "react";
import Pagination from "@mui/material/Pagination";
import { Box, Stack, Typography } from "@mui/material";

import { exerciseOptions, fetchData } from "../utils/fetchData";
import ExerciseCard from "./ExerciseCard";
import Loader from "./Loader";

const Exercises = ({ exercises, setExercises, bodyPart }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const exercisesPerPage = 6; // Using a constant for exercises per page

  useEffect(() => {
    const fetchExercisesData = async () => {
      try {
        let exercisesData = [];

        const apiUrl =
          bodyPart === "all"
            ? "https://exercisedb.p.rapidapi.com/exercises"
            : `https://exercisedb.p.rapidapi.com/exercises/bodyPart/${bodyPart}`;

        exercisesData = await fetchData(apiUrl, exerciseOptions);
        setExercises(exercisesData);
      } catch (error) {
        console.error("Error fetching exercises:", error);
        // Handle error state or logging
      }
    };

    fetchExercisesData();
  }, [bodyPart, setExercises]);

  // Function to calculate current exercises to display
  const getCurrentExercises = () => {
    const indexOfLastExercise = currentPage * exercisesPerPage;
    const indexOfFirstExercise = indexOfLastExercise - exercisesPerPage;
    return exercises.slice(indexOfFirstExercise, indexOfLastExercise);
  };

  // Pagination function
  const paginate = (event, value) => {
    setCurrentPage(value);
    // Optionally, you can scroll to the top of the component
    // window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Conditional rendering based on data loading
  if (!exercises || exercises.length === 0) return <Loader />;

  const currentExercises = getCurrentExercises();

  return (
    <Box id="exercises" sx={{ mt: { lg: "109px" } }} mt="50px" p="20px">
      <Typography
        variant="h4"
        fontWeight="bold"
        sx={{ fontSize: { lg: "44px", xs: "30px" } }}
        mb="46px"
      >
        Showing Results
      </Typography>
      <Stack
        direction="row"
        sx={{ gap: { lg: "107px", xs: "50px" } }}
        flexWrap="wrap"
        justifyContent="center"
      >
        {currentExercises.map((exercise, idx) => (
          <ExerciseCard key={idx} exercise={exercise} />
        ))}
      </Stack>
      <Stack sx={{ mt: { lg: "114px", xs: "70px" } }} alignItems="center">
        {exercises.length > 9 && (
          <Pagination
            color="standard"
            shape="rounded"
            defaultPage={1}
            count={Math.ceil(exercises.length / exercisesPerPage)}
            page={currentPage}
            onChange={paginate}
            size="large"
          />
        )}
      </Stack>
    </Box>
  );
};

export default Exercises;
