package main

import (
	"crypto/rand"
	"encoding/hex"
	"flag"
	"fmt"
	"os"
)

func newUUIDv4() (string, error) {
	b := make([]byte, 16)
	if _, err := rand.Read(b); err != nil {
		return "", err
	}

	b[6] = (b[6] & 0x0f) | 0x40
	b[8] = (b[8] & 0x3f) | 0x80

	return fmt.Sprintf(
		"%s-%s-%s-%s-%s",
		hex.EncodeToString(b[0:4]),
		hex.EncodeToString(b[4:6]),
		hex.EncodeToString(b[6:8]),
		hex.EncodeToString(b[8:10]),
		hex.EncodeToString(b[10:16]),
	), nil
}

func main() {
	count := flag.Int("count", 1, "Uretilecek UUID adedi")
	flag.Parse()

	if *count < 1 || *count > 10000 {
		fmt.Fprintln(os.Stderr, "count 1 ile 10000 arasinda olmali")
		os.Exit(1)
	}

	for i := 0; i < *count; i++ {
		uuid, err := newUUIDv4()
		if err != nil {
			fmt.Fprintln(os.Stderr, "Hata:", err)
			os.Exit(1)
		}
		fmt.Println(uuid)
	}
}
