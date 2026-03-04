package main

import (
	"crypto/rand"
	"flag"
	"fmt"
	"math/big"
	"os"
	"strings"
)

const (
	upperChars  = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
	lowerChars  = "abcdefghijklmnopqrstuvwxyz"
	digitChars  = "0123456789"
	symbolChars = "!@#$%^&*()-_=+[]{};:,.?/|"
)

func pickChar(set string) (byte, error) {
	n, err := rand.Int(rand.Reader, big.NewInt(int64(len(set))))
	if err != nil {
		return 0, err
	}
	return set[n.Int64()], nil
}

func secureShuffle(chars []byte) error {
	for i := len(chars) - 1; i > 0; i-- {
		n, err := rand.Int(rand.Reader, big.NewInt(int64(i+1)))
		if err != nil {
			return err
		}
		j := int(n.Int64())
		chars[i], chars[j] = chars[j], chars[i]
	}
	return nil
}

func generate(length int, pools []string) (string, error) {
	if len(pools) == 0 {
		return "", fmt.Errorf("en az bir karakter seti secilmeli")
	}
	if length < len(pools) {
		return "", fmt.Errorf("length (%d), secili set sayisindan kucuk olamaz (%d)", length, len(pools))
	}

	all := strings.Join(pools, "")
	out := make([]byte, 0, length)

	for _, set := range pools {
		c, err := pickChar(set)
		if err != nil {
			return "", err
		}
		out = append(out, c)
	}

	for len(out) < length {
		c, err := pickChar(all)
		if err != nil {
			return "", err
		}
		out = append(out, c)
	}

	if err := secureShuffle(out); err != nil {
		return "", err
	}

	return string(out), nil
}

func main() {
	length := flag.Int("length", 16, "Parola uzunlugu")
	upper := flag.Bool("upper", true, "Buyuk harf kullan")
	lower := flag.Bool("lower", true, "Kucuk harf kullan")
	digits := flag.Bool("digits", true, "Rakam kullan")
	symbols := flag.Bool("symbols", true, "Sembol kullan")
	flag.Parse()

	if *length < 4 || *length > 256 {
		fmt.Fprintln(os.Stderr, "length 4 ile 256 arasinda olmali")
		os.Exit(1)
	}

	pools := make([]string, 0, 4)
	if *upper {
		pools = append(pools, upperChars)
	}
	if *lower {
		pools = append(pools, lowerChars)
	}
	if *digits {
		pools = append(pools, digitChars)
	}
	if *symbols {
		pools = append(pools, symbolChars)
	}

	password, err := generate(*length, pools)
	if err != nil {
		fmt.Fprintln(os.Stderr, "Hata:", err)
		os.Exit(1)
	}

	fmt.Println(password)
}
