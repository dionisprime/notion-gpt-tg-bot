import OpenAI from 'openai';
import config from 'config';

const CHATGPT_MODEL = 'gpt-3.5-turbo';

const ROLES = {
    ASSISTANT: 'assistant',
    SYSTEM: 'system',
    USER: 'user',
};

const openai = new OpenAI({
    apiKey: config.get('OPENAI_KEY'),
});

const getMessage = (m) => `
Напиши на основе этих тезисов последовательную эсоциональную историю: ${m}

Эти тезисы с описанием ключевых моментов дня.
Необходимо в итоге получить такую историю, что б я запомнил этот день и смог в последствии рассказать ее друзьям. 
Много текста не нужно, главное, чтобы были эмоции, правильная последовательность + учтение контекста.
`;

export async function chatGPT(message = '') {
    const messages = [
        {
            role: ROLES.SYSTEM, //задаём системное сообщение для GPT
            content:
                'Ты опытный копирайтер, который пишет краткие эмоциональные статьи для социальных сетей',
        },
        { role: ROLES.USER, content: getMessage(message) },
    ];
    try {
        const completion = await openai.chat.completions.create({
            messages,
            model: CHATGPT_MODEL,
        });

        return completion.choices[0].message;
    } catch (e) {
        console.error('Error while chat completion', e.message);
    }
}
