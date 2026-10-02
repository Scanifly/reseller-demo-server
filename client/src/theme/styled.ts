import styled from "styled-components";

export const Container = styled.div`
  max-width: 960px;
  margin: 0 auto;
  padding: 40px 20px;
`;

export const Header = styled.header`
  text-align: center;
  margin-bottom: 32px;
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 700;
  color: #1a1a2e;
`;

export const Subtitle = styled.p`
  margin-top: 8px;
  color: #6b7280;
  font-size: 0.95rem;
`;

export const Tabs = styled.div`
  display: flex;
  gap: 4px;
  background: #e5e7eb;
  padding: 4px;
  border-radius: 10px;
  margin-bottom: 24px;
`;

export const TabButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 10px 16px;
  border: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active }) => ($active ? "#1a1a2e" : "#6b7280")};
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 2px rgba(0, 0, 0, 0.1)" : "none"};

  &:hover {
    color: #1a1a2e;
  }
`;

export const Card = styled.div`
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  padding: 32px;
  margin-bottom: 24px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 600;
  color: #374151;
`;

export const Hint = styled.span`
  font-size: 0.85rem;
  font-weight: 400;
  line-height: 1.45;
  color: #9ca3af;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    font-size: 0.95em;
    color: #6b7280;
  }
`;

const inputStyles = `
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 0.95rem;
  transition: border-color 0.15s;
  background: #ffffff;

  &:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
  }

  &::placeholder {
    color: #9ca3af;
  }
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const Select = styled.select`
  ${inputStyles}
  cursor: pointer;
`;

export const CheckboxGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 8px 16px;
`;

export const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  color: #374151;
  cursor: pointer;

  input {
    width: 16px;
    height: 16px;
    cursor: pointer;
  }
`;

export const SubmitButton = styled.button`
  padding: 12px 24px;
  background: #3b82f6;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: #2563eb;
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export const LinkButton = styled.button`
  align-self: flex-start;
  margin-top: 8px;
  padding: 8px 16px;
  background: transparent;
  color: #2563eb;
  border: 1px solid #93c5fd;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;

  &:hover {
    background: #eff6ff;
  }
`;

export const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.9rem;
  background: #fef2f2;
  border: 1px solid #fecaca;
  border-radius: 8px;
  padding: 12px 16px;
`;

export const SuccessMessage = styled.div`
  color: #065f46;
  font-size: 0.9rem;
  background: #ecfdf5;
  border: 1px solid #a7f3d0;
  border-radius: 8px;
  padding: 12px 16px;

  code {
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    background: #d1fae5;
    padding: 2px 6px;
    border-radius: 4px;
  }
`;

/**
 * Groups a set of fields under a rule and a heading, used to separate a form's
 * optional section from the fields above it.
 */
export const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding-top: 20px;
  border-top: 1px solid #e5e7eb;
`;

export const SectionTitle = styled.p`
  margin: 0;
  font-size: 0.9rem;
  font-weight: 600;
  color: #374151;
`;

export const IframeWrapper = styled.div`
  width: 100%;
  height: 700px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  iframe {
    width: 100%;
    height: 100%;
    border: none;
  }
`;
