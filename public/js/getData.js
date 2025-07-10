// fetches data from the API
async function getData(url, query) {
  try {

    const requestUrl = query ? `${url}?query=${encodeURIComponent(query)}` : url;
    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();

    // Return the data so it can be used
    return data;
  } catch (error) {
    console.error('Error in getData:', error);
  }
}

// Make the function available for import
export default getData;