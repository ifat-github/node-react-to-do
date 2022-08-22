import { render, screen, act, fireEvent } from "@testing-library/react";
import { unmountComponentAtNode } from "react-dom";
import List from "./List";


describe('List "Done" screen', () => {
    let container = null;

    beforeEach(() => {
        jest.spyOn(global, 'fetch').mockResolvedValue({
            json: jest.fn().mockResolvedValue(
                [
                    { "_id": 1, "title": "Wash Dishes", "isDone": true },
                    { "_id": 2, "title": "Clean Windows", "isDone": true },
                    { "_id": 3, "title": "Water Plants", "isDone": false }
                ]
            )
        })

        container = document.createElement("div");
        document.body.appendChild(container);
    });

    afterEach(() => {
        jest.restoreAllMocks();
        unmountComponentAtNode(container);
        container.remove();
        container = null;
    });

    test("Shouldn't be able to create a new item in the \"Done\" screen", async () => {
        await act(async () => render(<List mode="done" />, container));
        expect(screen.queryByTestId("create", { selector: 'label' })).toBeFalsy();
    });

    test("Should be able to search an item", async () => {
        await act(async () => render(<List mode="done" />, container));
        const searchInput = screen.getByTestId("search-value", { selector: 'input' });
        expect(searchInput.value).toEqual('');
        await act(() => {
            fireEvent.change(searchInput, { target: { value: "Wi" } });
        });
        expect(screen.getByLabelText("Clean Windows")).toBeTruthy();
        expect(() => screen.getByLabelText("Wash Dishes")).toThrow();
    });

    test("Shouldn't be able to change just one \"Done\" item to \"Not-Done\"", async () => {
        await act(async () => render(<List mode="done" />, container));

        const doneItemInput = screen.getByTestId("done-2");
        expect(doneItemInput.checked).toEqual(false);
        await act(() => {
            fireEvent.click(doneItemInput);
        });
        expect(doneItemInput.checked).toEqual(true);

        const markNotDoneButton = screen.getByTestId("mark-not-done").closest('button');
        expect(markNotDoneButton).toBeDisabled();
        await act(() => {
            fireEvent.click(markNotDoneButton);
        });
        expect(screen.getByTestId("done-2")).toBeTruthy();
    });

    test("Should be able to change more than one \"Done\" item to \"Not-Done\"", async () => {
        await act(async () => render(<List mode="done" />, container));

        const doneItemInput1 = screen.getByTestId("done-1");
        expect(doneItemInput1.checked).toEqual(false);
        await act(() => {
            fireEvent.click(doneItemInput1);
        });
        expect(doneItemInput1.checked).toEqual(true);

        const markNotDoneButton = screen.getByTestId("mark-not-done").closest('button');
        expect(markNotDoneButton).toBeDisabled();

        const doneItemInput2 = screen.getByTestId("done-2");
        expect(doneItemInput2.checked).toEqual(false);
        await act(() => {
            fireEvent.click(doneItemInput2);
        });
        expect(doneItemInput2.checked).toEqual(true);

        expect(markNotDoneButton).not.toBeDisabled();

        await act(() => {
            fireEvent.click(markNotDoneButton);
        });
        await expect(() => screen.getByLabelText("Unmarked Succesfully.")).toBeTruthy();
    });
})    
