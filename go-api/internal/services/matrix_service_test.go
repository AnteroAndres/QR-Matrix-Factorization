package services

import (
	"fmt"
	"testing"

	"qr-go-api/internal/models"

	"github.com/stretchr/testify/assert"
)

func TestValidateMatrix(t *testing.T) {
	service := NewMatrixService(nil)

	tests := []struct {
		name    string
		matrix  models.Matrix
		wantErr bool
	}{
		{
			name:    "valid matrix 3x2",
			matrix:  models.Matrix{{1, 2}, {3, 4}, {5, 6}},
			wantErr: false,
		},
		{
			name:    "valid matrix 3x3",
			matrix:  models.Matrix{{1, 2, 3}, {4, 5, 6}, {7, 8, 9}},
			wantErr: false,
		},
		{
			name:    "empty matrix",
			matrix:  models.Matrix{},
			wantErr: true,
		},
		{
			name:    "inconsistent rows",
			matrix:  models.Matrix{{1, 2}, {3, 4, 5}},
			wantErr: true,
		},
		{
			name:    "empty row",
			matrix:  models.Matrix{{}},
			wantErr: true,
		},
		{
			name:    "more columns than rows (invalid)",
			matrix:  models.Matrix{{1, 2, 3}, {4, 5, 6}}, // 2x3, should fail
			wantErr: true,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := service.ValidateMatrix(tt.matrix)
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
			}
		})
	}
}

func TestComputeQR_3x3(t *testing.T) {
	service := NewMatrixService(nil)

	matrix := models.Matrix{
		{12, -51, 4},
		{6, 167, -68},
		{-4, 24, -41},
	}

	q, r, err := service.ComputeQR(matrix)
	
	assert.NoError(t, err, "QR factorization should not fail")
	assert.NotNil(t, q, "Q matrix should not be nil")
	assert.NotNil(t, r, "R matrix should not be nil")
	
	assert.Equal(t, 3, len(q), "Q should have 3 rows")
	assert.Equal(t, 3, len(q[0]), "Q should have 3 columns")
	assert.Equal(t, 3, len(r), "R should have 3 rows")
	assert.Equal(t, 3, len(r[0]), "R should have 3 columns")

	reconstructed := multiplyMatrices(q, r)
	for i := 0; i < len(matrix); i++ {
		for j := 0; j < len(matrix[0]); j++ {
			assert.InDelta(t, matrix[i][j], reconstructed[i][j], 1e-10, 
				fmt.Sprintf("Q*R should reconstruct original at [%d][%d]", i, j))
		}
	}

	t.Logf("Q matrix:\n%v", formatMatrix(q))
	t.Logf("R matrix:\n%v", formatMatrix(r))
}

func TestComputeQR_4x3(t *testing.T) {
	service := NewMatrixService(nil)

	matrix := models.Matrix{
		{12, -51, 4},
		{6, 167, -68},
		{-4, 24, -41},
		{1, 1, 0},
	}

	q, r, err := service.ComputeQR(matrix)
	
	assert.NoError(t, err, "QR factorization should not fail for 4x3 matrix")
	assert.NotNil(t, q, "Q matrix should not be nil")
	assert.NotNil(t, r, "R matrix should not be nil")
	
	assert.Equal(t, 4, len(q), "Q should have 4 rows")
	assert.Equal(t, 3, len(q[0]), "Q should have 3 columns (economic)")
	assert.Equal(t, 3, len(r), "R should have 3 rows")
	assert.Equal(t, 3, len(r[0]), "R should have 3 columns")

	t.Logf("Q matrix (4x3):\n%v", formatMatrix(q))
	t.Logf("R matrix (3x3):\n%v", formatMatrix(r))

	reconstructed := multiplyMatrices(q, r)
	for i := 0; i < len(matrix); i++ {
		for j := 0; j < len(matrix[0]); j++ {
			assert.InDelta(t, matrix[i][j], reconstructed[i][j], 1e-10, 
				fmt.Sprintf("Q*R should reconstruct original at [%d][%d]", i, j))
		}
	}
}

func TestComputeQR_5x4(t *testing.T) {
	service := NewMatrixService(nil)

	matrix := models.Matrix{
		{12, -51, 4, 1},
		{6, 167, -68, 2},
		{-4, 24, -41, 3},
		{1, 0, 2, 1},
		{2, 1, 0, 1},
	}

	q, r, err := service.ComputeQR(matrix)
	
	assert.NoError(t, err, "QR factorization should not fail for 5x4 matrix")
	assert.NotNil(t, q, "Q matrix should not be nil")
	assert.NotNil(t, r, "R matrix should not be nil")
	
	assert.Equal(t, 5, len(q), "Q should have 5 rows")
	assert.Equal(t, 4, len(q[0]), "Q should have 4 columns")
	assert.Equal(t, 4, len(r), "R should have 4 rows")
	assert.Equal(t, 4, len(r[0]), "R should have 4 columns")

	t.Logf("Q matrix (5x4):\n%v", formatMatrix(q))
	t.Logf("R matrix (4x4):\n%v", formatMatrix(r))

	reconstructed := multiplyMatrices(q, r)
	for i := 0; i < len(matrix); i++ {
		for j := 0; j < len(matrix[0]); j++ {
			assert.InDelta(t, matrix[i][j], reconstructed[i][j], 1e-9, 
				fmt.Sprintf("Q*R should reconstruct original at [%d][%d]", i, j))
		}
	}
}

func TestComputeQR_WithZeroColumn(t *testing.T) {
	service := NewMatrixService(nil)

	matrix := models.Matrix{
		{12, -51, 4, 0},
		{6, 167, -68, 0},
		{-4, 24, -41, 0},
		{0, 0, 0, 0},
		{0, 0, 0, 0},
	}

	q, r, err := service.ComputeQR(matrix)
	
	if err != nil {
		t.Logf("Expected failure for matrix with zero column: %v", err)
		return
	}
	
	assert.NotNil(t, q, "Q matrix should not be nil")
	assert.NotNil(t, r, "R matrix should not be nil")
	
	t.Logf("Q matrix:\n%v", formatMatrix(q))
	t.Logf("R matrix:\n%v", formatMatrix(r))
}

func multiplyMatrices(a, b models.Matrix) models.Matrix {
	rowsA := len(a)
	colsA := len(a[0])
	colsB := len(b[0])
	
	result := make(models.Matrix, rowsA)
	for i := 0; i < rowsA; i++ {
		result[i] = make([]float64, colsB)
		for j := 0; j < colsB; j++ {
			sum := 0.0
			for k := 0; k < colsA; k++ {
				sum += a[i][k] * b[k][j]
			}
			result[i][j] = sum
		}
	}
	
	return result
}

func formatMatrix(m models.Matrix) string {
	result := ""
	for _, row := range m {
		result += "["
		for j, val := range row {
			if j > 0 {
				result += ", "
			}
			result += fmt.Sprintf("%.4f", val)
		}
		result += "]\n"
	}
	return result
}

func TestComputeQR_Orthogonality(t *testing.T) {
	service := NewMatrixService(nil)

	matrix := models.Matrix{
		{12, -51, 4},
		{6, 167, -68},
		{-4, 24, -41},
	}

	q, _, err := service.ComputeQR(matrix)
	assert.NoError(t, err)

	qTranspose := transposeMatrix(q)
	identity := multiplyMatrices(qTranspose, q)

	for i := 0; i < len(identity); i++ {
		for j := 0; j < len(identity[0]); j++ {
			expected := 0.0
			if i == j {
				expected = 1.0
			}
			assert.InDelta(t, expected, identity[i][j], 1e-10, 
				fmt.Sprintf("Q^T*Q should be identity at [%d][%d]", i, j))
		}
	}
}

func transposeMatrix(m models.Matrix) models.Matrix {
	rows := len(m)
	cols := len(m[0])
	
	result := make(models.Matrix, cols)
	for i := 0; i < cols; i++ {
		result[i] = make([]float64, rows)
		for j := 0; j < rows; j++ {
			result[i][j] = m[j][i]
		}
	}
	
	return result
}