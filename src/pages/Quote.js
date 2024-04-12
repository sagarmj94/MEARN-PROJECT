import React, { useEffect, useState } from "react";
import "./quote.css"; // Ensure the CSS path is correct

const Quote = () => {
  const [displayedQuote, setDisplayedQuote] = useState("");
  const [quoteInput, setQuoteInput] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to fetch the quote from the server
  const fetchQuote = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("Authentication token is not available.");
        setLoading(false);
        return;
      }
      const response = await fetch("http://localhost:5000/api/quote", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setDisplayedQuote(data.quote);
        setName(data.name); // Assume API returns 'name' alongside 'quote'
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Fetching failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Initially fetch the quote when the component mounts
  useEffect(() => {
    fetchQuote();
  }, []);

  // Function to post a new quote to the server
  const handlePostQuote = async () => {
    if (!quoteInput.trim()) return; // Prevent posting empty quotes

    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:5000/api/quote", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
        body: JSON.stringify({ quote: quoteInput }),
      });
      const data = await response.json();
      if (data.status === "ok") {
        fetchQuote();
        setQuoteInput("");
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Posting failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-container">
      {loading && <p className="loading">Processing...</p>}
      {error && <p className="error">Error: {error}</p>}
      <div className="quote-display">
        <p className="quote-text">{displayedQuote || "No quote available."}</p>
        <p className="author-text">— {name || "Anonymous"}</p>
      </div>
      <input
        className="quote-input"
        type="text"
        placeholder="Enter your quote here"
        value={quoteInput}
        onChange={(e) => setQuoteInput(e.target.value)}
      />
      <button className="quote-button" onClick={handlePostQuote}>
        Post Quote
      </button>
    </div>
  );
};

export default Quote;
