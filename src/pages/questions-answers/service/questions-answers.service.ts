import type { IQuestionsAndAnswers } from '@/interfaces/QA.interface';
import { api } from '@/services/api.service';

export const getQuestionsAnswers = async (): Promise<
    IQuestionsAndAnswers[]
> => {
    try {
        const response = await api.get('/questions-answers');
        return response.data.data;
    } catch (error) {
        console.error('Error fetching questions and answers:', error);
        throw error;
    }
};

export const createQuestionAnswer = async (
    question: string,
    answer: string
): Promise<IQuestionsAndAnswers> => {
    try {
        const response = await api.post<IQuestionsAndAnswers>(
            '/questions-answers',
            { question, answer }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating question and answer:', error);
        throw error;
    }
};

export const deleteQuestionAnswer = async (
    questions_answersId: string[]
): Promise<void> => {
    try {
        await api.delete(`/questions-answers`, {
            data: { questions_answersId },
        });
    } catch (error) {
        console.error('Error deleting question and answer:', error);
        throw error;
    }
};

export const updateQuestionAnswer = async (
    id: string,
    question: string,
    answer: string
): Promise<IQuestionsAndAnswers> => {
    try {
        const response = await api.put<IQuestionsAndAnswers>(
            `/questions-answers/${id}`,
            { question, answer }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating question and answer:', error);
        throw error;
    }
};

export const createMultipleQuestionsAnswers = async (
    questionsAnswers: IQuestionsAndAnswers[]
): Promise<IQuestionsAndAnswers[]> => {
    try {
        const response = await api.post<IQuestionsAndAnswers[]>(
            '/questions-answers/submit-multiple',
            { questionsAnswers }
        );
        return response.data;
    } catch (error) {
        console.error('Error creating multiple questions and answers:', error);
        throw error;
    }
};
