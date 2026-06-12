import * as React from "react"

export default function ErrorPage({ statusCode }: { statusCode: number }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "100vh",
      backgroundColor: "#050508",
      color: "#fff",
      fontFamily: "system-ui, sans-serif",
      padding: "24px",
      textAlign: "center",
    }}>
      <h1 style={{ fontSize: "48px", fontWeight: 700, margin: "0 0 16px" }}>
        {statusCode}
      </h1>
      <p style={{ color: "#999", marginBottom: "32px" }}>
        {statusCode === 404 ? "Page not found" : "An error occurred"}
      </p>
      <a
        href="/dashboard"
        style={{
          padding: "12px 24px",
          backgroundColor: "#0A84FF",
          color: "#fff",
          borderRadius: "9999px",
          textDecoration: "none",
          fontWeight: 500,
        }}
      >
        Go to Dashboard
      </a>
    </div>
  )
}

ErrorPage.getInitialProps = ({ res, err }: any) => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404
  return { statusCode }
}
