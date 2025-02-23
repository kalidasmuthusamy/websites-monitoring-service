declare module '@tillhub/tableify' {
  export interface TableifyOptions<T = unknown> {
    /**
     * Function to determine the class for a body cell
     * @param row The current row data
     * @param col The current column name
     * @param content The cell content
     * @returns The class name to apply to the cell
     */
    bodyCellClass?: (row: T, col: string, content: unknown) => string | undefined;
    
    /**
     * Function to determine the class for a header cell
     * @param col The column name
     * @returns The class name to apply to the header cell
     */
    headerCellClass?: (col: string) => string | undefined;
    
    /**
     * Function to transform the header text
     * @param col The column name
     * @returns The transformed header text
     */
    headerText?: (col: string) => string;
  }

  /**
   * Converts an array of objects into an HTML table
   * @param data The array of objects to convert
   * @param options Configuration options for the table
   * @returns HTML string representing the table
   */
  export function tableify<T = unknown>(data: T[], options?: TableifyOptions<T>): string;
  
  export default tableify;
  export { TableifyOptions };
}
