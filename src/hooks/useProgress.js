import { useState, useEffect } from 'react';

const PROGRESS_KEY = 'quentin-learning-progress';

export function useProgress() {
    const [completedExercises, setCompletedExercises] = useState([]);

    useEffect(() => {
        // Charger la progression initiale depuis le localStorage
        const savedProgress = localStorage.getItem(PROGRESS_KEY);
        if (savedProgress) {
            try {
                setCompletedExercises(JSON.parse(savedProgress));
            } catch (e) {
                console.error("Erreur de lecture de la progression", e);
            }
        }
    }, []);

    const markExerciseCompleted = (exerciseId) => {
        setCompletedExercises((prev) => {
            // Éviter les doublons
            if (prev.includes(exerciseId)) return prev;

            const newProgress = [...prev, exerciseId];
            // Sauvegarder dans le localStorage
            localStorage.setItem(PROGRESS_KEY, JSON.stringify(newProgress));
            return newProgress;
        });
    };

    const isExerciseCompleted = (exerciseId) => {
        return completedExercises.includes(exerciseId);
    };

    const resetProgress = () => {
        if (window.confirm("Êtes-vous sûr de vouloir tout réinitialiser ?")) {
            localStorage.removeItem(PROGRESS_KEY);
            setCompletedExercises([]);
            window.location.reload();
        }
    }

    return {
        completedExercises,
        markExerciseCompleted,
        isExerciseCompleted,
        resetProgress
    };
}
