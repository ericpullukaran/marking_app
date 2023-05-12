"use client";
import React, { createContext, useState, useEffect, ReactNode } from "react";
import { MarkingComments } from "./page";

export type MarkingSchemaContextProps = {
  markingSchema: MarkingComments;
  updateMarkingSchema: (schema: MarkingComments) => void;
};

// Create a new context
const MarkingSchemaContext = createContext<
  MarkingSchemaContextProps | undefined
>(undefined);

type MarkingSchemaProviderProps = {
  children: ReactNode;
};

// Create a custom provider for the context
const MarkingSchemaProvider = ({ children }: MarkingSchemaProviderProps) => {
  const [markingSchema, setMarkingSchema] = useState<any | null>(null);

  useEffect(() => {
    // Check if marking_schema exists in local storage
    const storedMarkingSchema = localStorage.getItem("marking_schema");
    if (storedMarkingSchema) {
      // If found, parse the JSON and set it as the initial markingSchema state
      setMarkingSchema(JSON.parse(storedMarkingSchema));
    }
  }, []);

  // Function to update the markingSchema state and also save it to local storage
  const updateMarkingSchema = (newMarkingSchema: MarkingComments): void => {
    setMarkingSchema(newMarkingSchema);
    localStorage.setItem("marking_schema", JSON.stringify(newMarkingSchema));
  };

  return (
    <MarkingSchemaContext.Provider
      value={{ markingSchema, updateMarkingSchema }}
    >
      {children}
    </MarkingSchemaContext.Provider>
  );
};

export { MarkingSchemaContext, MarkingSchemaProvider };
