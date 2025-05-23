import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

function isValidPrompt(input) {
  const trimmed = input.trim();
  return trimmed.length >= 22 || trimmed.split(/\s+/).length >= 5;
}

export function usePromptSuggestions(input, model, modelDescription) {
  const shouldFetch = isValidPrompt(input) && !!model;

  const { data, error, isLoading } = useSWR(
    shouldFetch
      ? [`/api/suggest-prompts`, input, model, modelDescription]
      : null,
    ([_, input, model, description]) => {
      const query = new URLSearchParams({
        input,
        model,
        description,
      }).toString();

      return fetch(`/api/suggest-prompts?${query}`).then((res) => res.json());
    },
    {
      revalidateOnFocus: false,
      dedupingInterval: 3000,
    }
  );

  return {
    suggestions: data?.suggestions || [],
  };
}
