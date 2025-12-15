package services

import (
	"errors"
	"fmt"

	"qr-go-api/internal/models"

	"gonum.org/v1/gonum/mat"
)

type MatrixService struct {
	httpClient *HTTPClient
}

func NewMatrixService(httpClient *HTTPClient) *MatrixService {
	return &MatrixService{
		httpClient: httpClient,
	}
}

func (s *MatrixService) ValidateMatrix(matrix models.Matrix) error {
	if len(matrix) == 0 {
		return errors.New("matrix cannot be empty")
	}

	if len(matrix[0]) == 0 {
		return errors.New("matrix rows cannot be empty")
	}

	cols := len(matrix[0])
	for i, row := range matrix {
		if len(row) != cols {
			return fmt.Errorf("row %d has %d columns, expected %d", i, len(row), cols)
		}
	}

	rows := len(matrix)
	if rows < cols {
		return fmt.Errorf("matrix must have at least as many rows as columns (got %dx%d)", rows, cols)
	}

	return nil
}

func (s *MatrixService) ComputeQR(matrix models.Matrix) (models.Matrix, models.Matrix, error) {
	rows := len(matrix)
	cols := len(matrix[0])

	data := make([]float64, rows*cols)
	for i, row := range matrix {
		for j, val := range row {
			data[i*cols+j] = val
		}
	}

	gonumMatrix := mat.NewDense(rows, cols, data)

	var qr mat.QR
	qr.Factorize(gonumMatrix)

	minDim := cols
	if rows < cols {
		minDim = rows
	}

	qFull := mat.NewDense(rows, rows, nil)
	qr.QTo(qFull)

	q := mat.NewDense(rows, minDim, nil)
	for i := 0; i < rows; i++ {
		for j := 0; j < minDim; j++ {
			q.Set(i, j, qFull.At(i, j))
		}
	}

	r := mat.NewDense(minDim, cols, nil)
	qr.RTo(r)

	qMatrix := make(models.Matrix, rows)
	for i := 0; i < rows; i++ {
		qMatrix[i] = make([]float64, minDim)
		for j := 0; j < minDim; j++ {
			qMatrix[i][j] = q.At(i, j)
		}
	}

	rMatrix := make(models.Matrix, minDim)
	for i := 0; i < minDim; i++ {
		rMatrix[i] = make([]float64, cols)
		for j := 0; j < cols; j++ {
			rMatrix[i][j] = r.At(i, j)
		}
	}

	return qMatrix, rMatrix, nil
}

func (s *MatrixService) GetStatistics(q, r models.Matrix, token string) (*models.StatisticsResponse, error) {
	request := models.StatisticsRequest{
		Q: q,
		R: r,
	}

	return s.httpClient.PostStatistics(request, token)
}