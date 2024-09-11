// import { from "../utils";

export type GlobalRecord = Record<string, any> | any;

export interface RequestResponseInt {
    data: GlobalRecord;
    success: boolean;
    message: string;
}

export interface RequestInt {
    post: (data: {
        url: string;
        data?: FormData;
    }) => Promise<RequestResponseInt>;

    get: (
        url: string,
    ) => Promise<RequestResponseInt>;
}
export const request: RequestInt = {
    get: async (url) => {
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "*/*",
                },
            });

            let data = await response.json();
            return { data, success: true, message: response.statusText };
        } catch (err) {
            console.error(err);
            throw handleError(err);
        }
    },

    post: async ({ url, data }) => {
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Accept": "*/*",
                },
                body: data,
            });
            const responseData = await response.json();
            return {
                data: responseData,
                success: response.ok,
                message: response.statusText,
            };
        } catch (err) {
            throw handleError(err);
        }
    },
};

export const handleError = (err: any): ErrorResponseInt => {
    const errorPayload: ErrorResponseInt = {
        message: "Something went wrong",
        statusCode: 500,
        errorCode: 0,
    };
    if (err?.name === "TypeError") {
        errorPayload.message = err.message || "Something went wrong with your request";
    }
    return errorPayload;
};

export interface ErrorResponseInt {
    message: string;
    statusCode: number;
    errorCode: number;
}

