import React from "react";
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit-browserify";
import blobStream from "blob-stream";

import {
  BookIcon,
  Container,
  MainArea,
  Wrapper,
  NewBook,
  RegisteredBooks,
  AddBook,
  Books,
  Table,
  TableRow,
  TableHeading,
  TableData,
  TableHead,
  HeadRow,
  DownloadButton,
} from "../../styles/dashboard.elements";

import SideBar from "@/components/SideBar";
import Header from "@/components/Header";

const Index = ({ books, loggedInUser }) => {
  async function generateAndDownloadCertificate({
    bookTitle,
    bookEdition,
    dob,
    yop,
    publisher,
    website,
    country,
    publishingDate,
    authorName,
    isbn,
    hash,
    blockHash,
    transactionHash,
  }) {
    try {
      //Block chain url
      const url = `https://goerli.etherscan.io/tx/${transactionHash}`;

      // Create a new PDF document
      const doc = new PDFDocument();

      // Set the document title
      doc.info.Title = "Block chain certificate";

      // Add some content to the document
      doc.fontSize(18).text("Block chain certificate", {
        align: "center",
      });
      doc
        .fontSize(14)
        .text(`User Data`, 100, 120, { fontWeight: "bold", underline: true });
      doc.fontSize(12).text(`Book Name:  ${bookTitle}`, 100, 150);
      doc.fontSize(12).text(`Author:  ${authorName}`, 100, 170);
      doc.fontSize(12).text(`Book Edition: ${bookEdition}`, 100, 190);
      doc.fontSize(12).text(`ISBN Number: ${isbn}`, 100, 210);
      doc.fontSize(12).text(`Year of Publication: ${yop}`, 100, 230);
      doc.fontSize(12).text(`Publishing Date: ${publishingDate}`, 100, 250);
      doc.fontSize(12).text(`Publisher: ${publisher}.`, 100, 270);
      doc.fontSize(12).text(`Country: ${country}.`, 100, 290);
      doc.fontSize(12).text(`Website: ${website}.`, 100, 310);

      doc.fontSize(14).text(`Transaction Data`, 100, 340, {
        fontWeight: "bold",
        underline: true,
      });
      doc.fontSize(12).text(`Book Hash: ${hash}.`, 100, 360);
      doc.fontSize(12).text(`Block Hash: ${blockHash}.`, 100, 400);
      doc.fontSize(12).text(`Transaction Hash: ${transactionHash}.`, 100, 440);
      doc
        .fontSize(12)
        .fillColor("blue")
        .text("Verify Transaction on BlockChain", 100, 480, {
          link: url,
          underline: true,
        });

      // Create a new blob stream
      const stream = doc.pipe(blobStream());

      // When the PDF is finished, generate a blob and download it
      stream.on("finish", () => {
        const url = stream.toBlobURL("application/pdf");
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.download = "certificate.pdf";
        a.click();
        document.body.removeChild(a);
      });

      // End the document to finalize the PDF
      doc.end();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <Container>
      <SideBar />

      <MainArea>
        <Header user={loggedInUser} />

        <Wrapper>
          <NewBook>
            <AddBook href="/addbook">+ Register New Copyright</AddBook>
          </NewBook>
          <RegisteredBooks>
            <Books>
              <Table>
                <TableHead>
                  <HeadRow>
                    <TableHeading>Book Title</TableHeading>
                    <TableHeading>Registration Date</TableHeading>
                    <TableHeading>Author</TableHeading>
                    <TableHeading>ISBN</TableHeading>
                    <TableHeading>Certificate</TableHeading>
                  </HeadRow>
                </TableHead>
                <tbody>
                  {books &&
                    books.map((book) => (
                      <TableRow key={book._id}>
                        <TableData
                          style={{
                            display: "flex",
                            alignItem: "center",
                            justifyContent: "flex-start",
                            paddingLeft: "0px",
                          }}
                          key={book._id}
                        >
                          <BookIcon src="/images/book-icon.svg" />{" "}
                          {book.bookTitle}
                        </TableData>
                        <TableData>{book.publishingDate}</TableData>
                        <TableData>{book.authorName}</TableData>
                        <TableData>{book.isbn}</TableData>

                        <TableData>
                          <DownloadButton
                            onClick={() =>
                              generateAndDownloadCertificate(
                                book.bookTitle,
                                book.bookEdition,
                                book.dob,
                                book.yop,
                                book.publisher,
                                book.website,
                                book.country,
                                book.publishingDate,
                                book.authorName,
                                book.isbn,
                                book.hash,
                                book.txReceipt.blockHash,
                                book.txReceipt.transactionHash
                              )
                            }
                          >
                            Download
                          </DownloadButton>
                        </TableData>
                      </TableRow>
                    ))}
                </tbody>
              </Table>
            </Books>
          </RegisteredBooks>
        </Wrapper>
      </MainArea>
    </Container>
  );
};

export const getServerSideProps = async (ctx) => {
  const authToken = ctx.req.cookies.authToken;
  const userCookie = ctx.req.cookies.loggedInUser;
  let user = null;
  if (userCookie) {
    user = JSON.parse(userCookie);
  }

  if (authToken) {
    const verifyToken = jwt.verify(authToken, process.env.JWT_SECRET);

    if (!verifyToken || !verifyToken.id) {
      res.writeHead(302, { Location: "/signin" });
      res.end();
    }

    const result = await fetch(`${process.env.BASE_URL}/api/getbooks`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    const data = await result.json();

    return {
      props: {
        books: data.books,
        loggedInUser: user,
      },
    };
  } else {
    return {
      props: {
        books: [],
        loggedInUser: user,
      },
    };
  }
};

export default React.memo(Index);
