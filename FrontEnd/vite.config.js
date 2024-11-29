import react from '@vitejs/plugin-react';

export default {
    plugins: [
        react({
            fastRefresh: false, // Disable Fast Refresh
        }),
    ],
};
